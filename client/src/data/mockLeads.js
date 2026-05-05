export const leads = [
    // HIGH RISK (RED) Scenarios
    {
        leadName: "Tharun (High Risk: Long Call, No FU)",
        callDuration: 55,
        callsMade: 5,
        followUps: 0,
        daysSinceLastFollowUp: 1,
    },
    {
        leadName: "Rahul (High Risk: Ghosted)",
        callDuration: 25,
        callsMade: 8,
        followUps: 2,
        daysSinceLastFollowUp: 5, // Days > 3
    },
    {
        leadName: "Bob Johnson (High Risk: Mixed)",
        callDuration: 60,
        callsMade: 2,
        followUps: 0,
        daysSinceLastFollowUp: 4,
    },

    // MEDIUM RISK (YELLOW) Scenarios
    {
        leadName: "Sneha (Medium Risk: Short Calls)",
        callDuration: 15,
        callsMade: 5,
        followUps: 1,
        daysSinceLastFollowUp: 1,
    },
    {
        leadName: "Vikram (Medium Risk: Borderline)",
        callDuration: 18,
        callsMade: 4,
        followUps: 1,
        daysSinceLastFollowUp: 2,
    },

    // HEALTHY DEAL (GREEN) Scenarios
    {
        leadName: "Kavya (Healthy: Great Engagement)",
        callDuration: 120,
        callsMade: 12,
        followUps: 5,
        daysSinceLastFollowUp: 0,
    },
    {
        leadName: "Donna Paulsen (Healthy: Strong Deal)",
        callDuration: 45,
        callsMade: 6,
        followUps: 4,
        daysSinceLastFollowUp: 1,
    },

    // DEFAULT (YELLOW) Scenarios
    {
        leadName: "Rachel Zane (Default: Low Activity)",
        callDuration: 10,
        callsMade: 0,
        followUps: 0,
        daysSinceLastFollowUp: 1,
    },
    {
        leadName: "Louis Litt (Default: Stagnant)",
        callDuration: 35,
        callsMade: 8,
        followUps: 5,
        daysSinceLastFollowUp: 1,
    },
    {
        leadName: "Jessica Pearson (Default: Safe Mode)",
        callDuration: 28,
        callsMade: 2,
        followUps: 1,
        daysSinceLastFollowUp: 3,
    },
];
