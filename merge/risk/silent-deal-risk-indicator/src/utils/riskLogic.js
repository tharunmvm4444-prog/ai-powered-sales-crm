/**
 * Calculates the risk level of a sales deal based on lead activity.
 * 
 * Rules:
 * 1. HIGH RISK (RED):
 *    - callDuration > 3 AND followUps === 0
 *    - daysSinceLastFollowUp > 3
 * 
 * 2. MEDIUM RISK (YELLOW):
 *    - callsMade >= 2
 *    - callDuration < 2
 *    - followUps === 1
 * 
 * 3. HEALTHY DEAL (GREEN):
 *    - callDuration >= 4
 *    - followUps >= 2
 *    - daysSinceLastFollowUp <= 2
 * 
 * 4. DEFAULT: YELLOW
 * 
 * @param {Object} lead - The lead object needing classification
 * @returns {string} - "RED", "YELLOW", or "GREEN"
 */
export const getDealRisk = (lead) => {
  const { callDuration, callsMade, followUps, daysSinceLastFollowUp } = lead;

  // 1. HIGH RISK (RED)
  // Assign RED if ANY condition is true:
  // Adjusted for higher scale: Duration > 30 (but no follow up) is bad investment?
  // Original: Duration > 3 & FollowUps == 0
  // New Idea: If you spent 30+ mins and sent 0 follow ups, that's a waste/risk.
  if (
    (callDuration > 30 && followUps === 0) ||
    daysSinceLastFollowUp > 3
  ) {
    return "RED";
  }

  // 3. HEALTHY DEAL (GREEN)
  // Original: callDuration >= 4
  // New: callDuration >= 40 (Good engagement)
  if (
    callDuration >= 40 &&
    followUps >= 2 &&
    daysSinceLastFollowUp <= 2
  ) {
    return "GREEN";
  }

  // 2. MEDIUM RISK (YELLOW)
  // Original: callDuration < 2
  // New: callDuration < 20 (Short calls even with multiple attempts)
  if (
    callsMade >= 2 &&
    callDuration < 20 &&
    followUps === 1
  ) {
    return "YELLOW";
  }

  // 4. DEFAULT
  return "YELLOW";
};
