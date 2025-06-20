from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Optional
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import uvicorn

# Initialize FastAPI app (only once)
app = FastAPI(
    title="Diabetes Prediction API",
    description="API for predicting diabetes risk based on patient data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input data model
class PatientData(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age in years")
    gender: str = Field(..., description="Patient gender (male, female, other)")
    bmi: float = Field(..., ge=10, le=50, description="Body Mass Index")
    bloodPressure: Dict[str, int] = Field(..., description="Blood pressure (systolic and diastolic)")
    glucoseLevel: float = Field(..., ge=50, le=500, description="Glucose level in mg/dL")
    insulinLevel: float = Field(..., ge=0, description="Insulin level in µU/mL")
    skinThickness: float = Field(..., ge=0, description="Skin thickness in mm")
    pregnancies: Optional[int] = Field(0, ge=0, description="Number of pregnancies (for females)")
    diabetesPedigreeFunction: float = Field(..., ge=0, description="Diabetes pedigree function")
    physicalActivity: str = Field("moderate", description="Physical activity level")
    smokingStatus: str = Field("never", description="Smoking status")
    alcoholConsumption: str = Field("none", description="Alcohol consumption level")
    familyHistory: bool = Field(False, description="Family history of diabetes")

    @validator('gender')
    def validate_gender(cls, v):
        if v.lower() not in ['male', 'female', 'other']:
            raise ValueError('Gender must be male, female, or other')
        return v.lower()

    @validator('physicalActivity')
    def validate_physical_activity(cls, v):
        valid_activities = ['sedentary', 'light', 'moderate', 'active', 'very active']
        if v.lower() not in valid_activities:
            raise ValueError(f'Physical activity must be one of {valid_activities}')
        return v.lower()

    @validator('smokingStatus')
    def validate_smoking_status(cls, v):
        valid_statuses = ['never', 'former', 'current']
        if v.lower() not in valid_statuses:
            raise ValueError(f'Smoking status must be one of {valid_statuses}')
        return v.lower()

    @validator('alcoholConsumption')
    def validate_alcohol_consumption(cls, v):
        valid_levels = ['none', 'light', 'moderate', 'heavy']
        if v.lower() not in valid_levels:
            raise ValueError(f'Alcohol consumption must be one of {valid_levels}')
        return v.lower()

    @validator('bloodPressure')
    def validate_blood_pressure(cls, v):
        if 'systolic' not in v or 'diastolic' not in v:
            raise ValueError('Blood pressure must include systolic and diastolic values')
        if not (70 <= v['systolic'] <= 250):
            raise ValueError('Systolic blood pressure must be between 70 and 250')
        if not (40 <= v['diastolic'] <= 150):
            raise ValueError('Diastolic blood pressure must be between 40 and 150')
        return v

# Define response model
class PredictionResponse(BaseModel):
    prediction: str
    probability: float
    features_importance: Dict[str, float]

# Paths for model files
MODEL_PATH = "models/diabetes_model.pkl"
SCALER_PATH = "models/scaler.pkl"

def train_model():
    """Train a new model if one doesn't exist"""
    print("Training new model...")
    
    # Create synthetic data
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'age': np.random.randint(18, 90, n_samples),
        'gender': np.random.choice(['male', 'female'], n_samples),
        'bmi': np.random.uniform(18, 40, n_samples),
        'systolic': np.random.randint(90, 180, n_samples),
        'diastolic': np.random.randint(60, 110, n_samples),
        'glucose': np.random.uniform(70, 200, n_samples),
        'insulin': np.random.uniform(0, 300, n_samples),
        'skin_thickness': np.random.uniform(10, 50, n_samples),
        'pregnancies': np.random.randint(0, 10, n_samples),
        'diabetes_pedigree': np.random.uniform(0.1, 2.5, n_samples),
        'physical_activity': np.random.choice(['sedentary', 'light', 'moderate', 'active', 'very active'], n_samples),
        'smoking': np.random.choice(['never', 'former', 'current'], n_samples),
        'alcohol': np.random.choice(['none', 'light', 'moderate', 'heavy'], n_samples),
        'family_history': np.random.choice([True, False], n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable
    probability = (
        (df['glucose'] - 70) / 130 * 0.4 + 
        (df['bmi'] - 18) / 22 * 0.3 + 
        (df['age'] - 18) / 72 * 0.2 + 
        df['family_history'].astype(int) * 0.1
    )
    probability += np.random.normal(0, 0.1, n_samples)
    probability = np.clip(probability, 0, 1)
    df['diabetes'] = (probability > 0.5).astype(int)
    
    # Prepare features
    df_encoded = pd.get_dummies(df, columns=['gender', 'physical_activity', 'smoking', 'alcohol'])
    X = df_encoded.drop('diabetes', axis=1)
    y = df_encoded['diabetes']
    
    # Split and scale data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    numerical_cols = ['age', 'bmi', 'systolic', 'diastolic', 'glucose', 'insulin', 
                     'skin_thickness', 'pregnancies', 'diabetes_pedigree']
    X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    print(f"Model accuracy: {model.score(X_test, y_test):.4f}")
    
    # Save model artifacts
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    with open("models/feature_names.txt", "w") as f:
        f.write(",".join(X_train.columns))
    
    return model, scaler, list(X_train.columns)

def load_or_train_model():
    """Load the model if it exists, otherwise train a new one"""
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        with open("models/feature_names.txt", "r") as f:
            feature_names = f.read().split(",")
        print("Model loaded successfully")
    except (FileNotFoundError, OSError):
        model, scaler, feature_names = train_model()
    return model, scaler, feature_names

# Load model at startup
model, scaler, feature_names = load_or_train_model()

def preprocess_input(patient_data: PatientData):
    """Convert patient data to model input format"""
    data = {
        'age': patient_data.age,
        'bmi': patient_data.bmi,
        'systolic': patient_data.bloodPressure['systolic'],
        'diastolic': patient_data.bloodPressure['diastolic'],
        'glucose': patient_data.glucoseLevel,
        'insulin': patient_data.insulinLevel,
        'skin_thickness': patient_data.skinThickness,
        'pregnancies': patient_data.pregnancies,
        'diabetes_pedigree': patient_data.diabetesPedigreeFunction,
        'family_history': patient_data.familyHistory,
        'gender': patient_data.gender,
        'physical_activity': patient_data.physicalActivity,
        'smoking': patient_data.smokingStatus,
        'alcohol': patient_data.alcoholConsumption
    }
    
    df = pd.DataFrame([data])
    df_encoded = pd.get_dummies(df, columns=['gender', 'physical_activity', 'smoking', 'alcohol'])
    
    # Ensure all expected columns are present
    for col in feature_names:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
    
    # Scale numerical features
    numerical_cols = ['age', 'bmi', 'systolic', 'diastolic', 'glucose', 'insulin', 
                     'skin_thickness', 'pregnancies', 'diabetes_pedigree']
    df_encoded[numerical_cols] = scaler.transform(df_encoded[numerical_cols])
    
    return df_encoded[feature_names]

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Diabetes Prediction API is running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(patient_data: PatientData):
    try:
        processed_data = preprocess_input(patient_data)
        prediction_proba = model.predict_proba(processed_data)[0]
        prediction_class = model.predict(processed_data)[0]
        
        # Format prediction
        if prediction_class == 1:
            prediction = "diabetic"
            probability = prediction_proba[1]
        else:
            prediction = "non-diabetic"
            probability = prediction_proba[0]
            
        if 0.4 <= prediction_proba[1] <= 0.6:
            prediction = "pre-diabetic"
            probability = max(prediction_proba)
        
        return {
            "prediction": prediction,
            "probability": float(probability),
            "features_importance": dict(zip(feature_names, model.feature_importances_))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)