export const calculateRiskLevel = (prediction, probability, patientData) => {
    // Base risk level on prediction and probability
    let riskLevel
  
    if (prediction === "non-diabetic") {
      if (probability < 0.2) {
        riskLevel = "low"
      } else {
        riskLevel = "moderate"
      }
    } else if (prediction === "pre-diabetic") {
      if (probability < 0.5) {
        riskLevel = "moderate"
      } else {
        riskLevel = "high"
      }
    } else {
      // diabetic
      if (probability < 0.8) {
        riskLevel = "high"
      } else {
        riskLevel = "very high"
      }
    }
  
    // Adjust risk level based on additional factors
  
    // Age factor
    if (patientData.age > 65) {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    // BMI factor
    if (patientData.bmi > 35) {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    // Blood pressure factor
    if (patientData.bloodPressure.systolic > 140 || patientData.bloodPressure.diastolic > 90) {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    // Family history factor
    if (patientData.familyHistory) {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    // Lifestyle factors
    if (patientData.physicalActivity === "sedentary") {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    if (patientData.smokingStatus === "current") {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    if (patientData.alcoholConsumption === "heavy") {
      riskLevel = upgradeRiskLevel(riskLevel)
    }
  
    return riskLevel
  }
  
  // Helper function to upgrade risk level
  const upgradeRiskLevel = (currentLevel) => {
    switch (currentLevel) {
      case "low":
        return "moderate"
      case "moderate":
        return "high"
      case "high":
        return "very high"
      default:
        return currentLevel
    }
  }
  