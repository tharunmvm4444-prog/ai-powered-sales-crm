import React from 'react';

const FeedbackCard = ({ score }) => {
    const getFeedback = (score) => {
        if (score >= 90) return { text: "Excellent Work!", color: "#EF4444", emoji: "🌟" };
        if (score >= 80) return { text: "Progressive", color: "#C0C0C0", emoji: "🚀" };
        if (score >= 70) return { text: "Decent Job", color: "#10B981", emoji: "✅" };
        if (score >= 60) return { text: "Can Do Better", color: "#008080", emoji: "🎯" };
        return { text: "Needs Improvement", color: "#FF7F50", emoji: "⚠️" };
    };

    const feedback = getFeedback(score);

    return (
        <div className="feedback-container" style={{ borderColor: feedback.color }}>
            <div className="feedback-emoji">{feedback.emoji}</div>
            <h2 style={{ color: feedback.color }}>{feedback.text}</h2>
            <p style={{ color: '#666' }}>
                {score >= 70 ? "Keep up the great momentum!" : "Focus on hitting your daily targets."}
            </p>
        </div>
    );
};

export default FeedbackCard;
