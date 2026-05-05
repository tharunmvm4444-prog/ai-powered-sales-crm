export const generateData = () => {
    const names = [
        "Tharun", "Rahul", "Sneha", "Vikram", "Kavya",
        "Eve", "Frank", "Grace", "Heidi", "Ivan"
    ];

    const calculateScore = (calls, duration, followUps) => {
        // Calls: Target 20, Max 40
        const callsScore = Math.min((calls / 20) * 40, 40);

        // Duration: Target 60, Max 40
        const durationScore = Math.min((duration / 60) * 40, 40);

        // FollowUps: Target 10, Max 20
        const followUpScore = Math.min((followUps / 10) * 20, 20);

        return Math.round(callsScore + durationScore + followUpScore);
    };

    // 1. Generate Raw Data
    const rawData = names.map((name, index) => {
        const callsMade = Math.floor(Math.random() * 30); // 0-29
        const totalDuration = Math.floor(Math.random() * 100); // 0-99
        const followUps = Math.floor(Math.random() * 15); // 0-14

        const score = calculateScore(callsMade, totalDuration, followUps);

        return {
            id: index + 1, // temporary id
            name,
            callsMade,
            totalDuration,
            followUps,
            score
        };
    });

    // 2. Sort Data (Ranking Logic)
    // Primary: Score (Desc), Secondary: Calls (Desc), Tertiary: Duration (Desc), etc.
    const sortedData = rawData.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.callsMade !== a.callsMade) return b.callsMade - a.callsMade;
        if (b.totalDuration !== a.totalDuration) return b.totalDuration - a.totalDuration;
        return b.followUps - a.followUps;
    });

    // 3. Assign Rank
    return sortedData.map((item, index) => ({
        ...item,
        rank: index + 1
    }));
};
