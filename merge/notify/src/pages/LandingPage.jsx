import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <h1>Welcome to Sales Dashboard</h1>
            <p className="subtitle">Please select your role to continue</p>

            <div className="role-cards">
                <div className="role-card sales-card">
                    <h2>Sales Portal</h2>
                    <p>Send follow-up emails to customers</p>
                    <Link to="/send-email" className="role-btn sales-btn">Enter as Salesperson</Link>
                </div>

                <div className="role-card manager-card">
                    <h2>Manager Dashboard</h2>
                    <p>View internal notifications and logs</p>
                    <Link to="/notifications" className="role-btn manager-btn">Enter as Manager</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
