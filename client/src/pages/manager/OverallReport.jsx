import React, { useMemo } from 'react';
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import { leads } from '../../data/mockLeads';
import { getDealRisk } from '../../utils/riskLogic';

import "./OverallReport.css";

const OverallReport = () => {
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
        <div className="container">
            <Sidebar />
            <div className="main">
                <Header />

                <div className="overall-report-container" style={{ padding: "20px" }}>


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
            </div>
        </div>
    );
};

export default OverallReport;
