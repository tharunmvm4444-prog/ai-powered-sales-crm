import React from 'react';
import { getScoreColor } from '../../utils/colors';

const SalespersonDetail = ({ data }) => {
    const color = getScoreColor(data.score);

    return (
        <div className="detail-container-full" style={{ borderTop: `10px solid ${color}` }}>
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ marginBottom: 0 }}>{data.name}</h1>
            </div>

            <div className="metrics-grid large">
                <div className="metric-item large">
                    <span className="metric-label">Calls : </span>
                    <span className="metric-value"  style={{ fontSize: "11px", fontWeight: 100, color: "#111" }}>{data.callsMade}</span>
                    <span className="metric-sub"><br></br> Target : 20</span>
                </div>

                <div className="metric-item large">
                    <span className="metric-label">Duration : </span>
                    <span className="metric-value"  style={{ fontSize: "11px", fontWeight: 100, color: "#111" }} >{data.totalDuration}m</span>
                    <span className="metric-sub"> <br></br>Target : 60m</span>
                </div>

                <div className="metric-item large">
                    <span className="metric-label">Follow-Ups : </span>
                    <span className="metric-value" style={{ fontSize: "11px", fontWeight: 100, color: "#111" }} >{data.followUps}m</span>
                    <span className="metric-sub"> <br></br>Target : 10m</span>
                </div>
            </div>

            <hr className="divider" />

            <div className="score-section" style={{ color: color }}>
                <h2 style={{ fontSize: '1.5rem', color: '#555' }}>Productivity Score</h2>
                <div className="score-display large">
                    {data.score}%
                </div>
            </div>
        </div>
    );
};

export default SalespersonDetail;
