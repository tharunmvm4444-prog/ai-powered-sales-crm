/**
 * Calculates the risk level of a sales deal based on lead activity.
 * 
 * Rules:
 * 1. HIGH RISK (RED):
 *    - callDuration > 30 AND followUps === 0
 *    - daysSinceLastFollowUp > 3
 * 
 * 2. MEDIUM RISK (YELLOW):
 *    - callsMade >= 2
 *    - callDuration < 20
 *    - followUps === 1
 * 
 * 3. HEALTHY DEAL (GREEN):
 *    - callDuration >= 40
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
    if (
        (callDuration > 30 && followUps === 0) ||
        daysSinceLastFollowUp > 3
    ) {
        return "RED";
    }

    // 3. HEALTHY DEAL (GREEN)
    if (
        callDuration >= 40 &&
        followUps >= 2 &&
        daysSinceLastFollowUp <= 2
    ) {
        return "GREEN";
    }

    // 2. MEDIUM RISK (YELLOW)
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
