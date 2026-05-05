import React, { useMemo } from 'react';
import { leads } from '../data/mockLeads';
import { getDealRisk } from '../utils/riskLogic';

const DealRiskDashboard = () => {
    // Process leads to include risk analysis
    const analyzedLeads = useMemo(() => {
        return leads.map(lead => ({
            ...lead,
            risk: getDealRisk(lead)
        }));
    }, []);

    // Helper to get visual styles based on risk level
    const getRiskStyles = (risk) => {
        switch (risk) {
            case 'RED':
                return {
                    label: 'High Risk',
                    icon: '🔴',
                    className: 'risk-badge risk-red'
                };
            case 'GREEN':
                return {
                    label: 'Healthy',
                    icon: '🟢',
                    className: 'risk-badge risk-green'
                };
            case 'YELLOW':
            default:
                return {
                    label: 'At Risk',
                    icon: '🟡',
                    className: 'risk-badge risk-yellow'
                };
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1>Silent Deal-Risk Indicator</h1>
                    <p className="subtitle">Sales Management System</p>
                </div>
                <div className="manager-badge">
                    🔒 Visible only to managers (Internal Use)
                </div>
            </header>

            <div className="card">
                <table className="risk-table">
                    <thead>
                        <tr>
                            <th>Lead Name</th>
                            <th>Call Duration (min)</th>
                            <th>Calls Made</th>
                            <th>Follow-Ups</th>
                            <th>Days Since Last</th>
                            <th>Risk Assessment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analyzedLeads.map((lead, index) => {
                            const { icon, label, className } = getRiskStyles(lead.risk);
                            return (
                                <tr key={index}>
                                    <td className="lead-name">{lead.leadName}</td>
                                    <td>{lead.callDuration}</td>
                                    <td>{lead.callsMade}</td>
                                    <td>{lead.followUps}</td>
                                    <td>{lead.daysSinceLastFollowUp}</td>
                                    <td>
                                        <span className={className}>
                                            {icon} {label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DealRiskDashboard;
