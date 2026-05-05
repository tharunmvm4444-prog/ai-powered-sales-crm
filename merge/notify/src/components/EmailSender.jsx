import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNotifications } from '../context/NotificationContext';

import { Link } from 'react-router-dom';

const EmailSender = () => {
    const [salespersonName, setSalespersonName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isError, setIsError] = useState(false);
    const { addNotification } = useNotifications();

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setIsError(false);

        // Validate
        if (!salespersonName || !customerName || !customerEmail) {
            setStatus('Please fill in all fields.');
            setIsError(true);
            return;
        }

        const templateParams = {
            salesperson_name: salespersonName,
            customer_name: customerName,
            email: customerEmail,
            reply_to: customerEmail
        };

        console.log('Sending parameters:', templateParams);

        // Service ID: service_rnzjj5j (Same as before)
        // Template ID: template_hmd469v (From user's code)
        // Public Key: cYfXTSQ7n2mfdvyes (From user's code)
        emailjs.send('service_rnzjj5j', 'template_hmd469v', templateParams, 'cYfXTSQ7n2mfdvyes')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setStatus('Email sent successfully!');

                // Notification Logic
                addNotification(`Follow-up email successfully sent to ${customerEmail}`);

                // Reset form
                setSalespersonName('');
                setCustomerName('');
                setCustomerEmail('');
            }, (err) => {
                console.error('FAILED...', err);
                const errorMessage = err.text || err.message || JSON.stringify(err);
                setStatus(`Failed to send: ${errorMessage}`);
                setIsError(true);
            });
    };

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1>Sales Portal</h1>
                <Link to="/" className="back-link">Exit to Home</Link>
            </header>
            <div className="email-sender-container">
                <h2>Send Follow-Up</h2>
                <p>Quickly send a personalized email to your customer.</p>
                <form onSubmit={sendEmail} className="email-form">
                    <div className="form-group">
                        <label>Your Name (Salesperson)</label>
                        <input
                            type="text"
                            value={salespersonName}
                            onChange={(e) => setSalespersonName(e.target.value)}
                            required
                            placeholder="e.g. Alex Johnson"
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            placeholder="e.g. Sarah Smith"
                        />
                    </div>
                    <div className="form-group">
                        <label>Customer Email</label>
                        <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                            placeholder="sarah@example.com"
                        />
                    </div>
                    <button type="submit" className="send-btn">Send Follow-Up Email</button>
                </form>
                {status && (
                    <p className={`status-msg ${isError ? 'error' : 'success'}`} style={{ color: isError ? 'red' : 'green' }}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailSender;
