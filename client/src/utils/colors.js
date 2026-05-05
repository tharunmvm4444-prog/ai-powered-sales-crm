export const getScoreColor = (score) => {
    // Mapping requested colors to Score Thresholds (+10)

    // 90-100: Red (Top performance - requested change)
    if (score >= 90) return '#EF4444'; // Red

    // 80-89: Silver (Second tier)
    if (score >= 80) return '#C0C0C0';

    // 70-79: Emerald/Forest Green (Solid)
    if (score >= 70) return '#10B981';

    // 60-69: Teal (Good)
    if (score >= 60) return '#008080';

    // 50-59: Navy Blue (Average)
    if (score >= 50) return '#1E3A8A';

    // 40-49: Coral (Below Average)
    if (score >= 40) return '#FF7F50';

    // < 40: Black/Charcoal (Low)
    return '#374151';
};
