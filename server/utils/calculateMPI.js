// utils/calculateMPI.js

const isDeprived = (response, conditionType, targetValue) => {
    switch (conditionType) {
      case "lessThan":
        return Number(response) < Number(targetValue);
      case "greaterThan":
        return Number(response) > Number(targetValue);
      case "equals":
        return response === targetValue;
      case "notEquals":
        return response !== targetValue;
      case "includes":
        if (Array.isArray(response)) {
          return response.includes(targetValue);
        }
        return false;
      default:
        return false;
    }
  };
  
  const calculateMPIForRespondents = (form, responses) => {
    const mpiQuestions = form.questions.filter((q) => q.mpi?.isMPIIndicator);
    const totalIndicators = mpiQuestions.length;
  
    const results = responses.map((responseDoc) => {
      const answers = responseDoc.answers;
  
      let deprivedCount = 0;
  
      mpiQuestions.forEach((question) => {
        const answer = answers.find((a) => a.question === question.question);
  
        if (answer && isDeprived(answer.response, question.mpi.conditionType, question.mpi.value)) {
          deprivedCount++;
        }
      });
  
      const mpiScore = totalIndicators > 0 ? deprivedCount / totalIndicators : 0;
      const isVulnerable = mpiScore >= 0.33;
  
      return {
        respondent: responseDoc.respondentDetails,
        deprivedCount,
        totalIndicators,
        mpiScore,
        isVulnerable,
      };
    });
  
    return results;
  };
  
  module.exports = calculateMPIForRespondents;
  