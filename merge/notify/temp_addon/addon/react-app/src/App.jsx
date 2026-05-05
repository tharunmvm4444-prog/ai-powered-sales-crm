import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './index.css';

function App() {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  // Configuration
  const SERVICE_ID = "service_rnzjj5j";
  const TEMPLATE_ID = "template_hmd469v";
  const PUBLIC_KEY = "cYfXTSQ7n2mfdvyes";

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    // We can use sendForm directly which is easier with React refs, 
    // OR use send() to manually construct params like we did in vanilla JS.
    // Let's use manually to ensure variables match exactly what we debugged.

    const formData = new FormData(form.current);
    const templateParams = {
      salesperson_name: formData.get('salesperson_name'),
      customer_name: formData.get('customer_name'),
      email: formData.get('email'), // Using 'email' as we fixed earlier
      reply_to: formData.get('email'),
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        setStatus({ message: 'Email sent successfully!', type: 'success' });
        form.current.reset();
      }, (error) => {
        console.log(error.text);
        setStatus({ message: 'Failed to send: ' + JSON.stringify(error), type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="card">
        <header>
          <h1>Send Follow-Up</h1>
          <p>Quickly send a personalized email to your customer.</p>
        </header>

        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label htmlFor="salesperson_name">Your Name (Salesperson)</label>
            <input
              type="text"
              name="salesperson_name"
              placeholder="e.g. Alex Johnson"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_name">Customer Name</label>
            <input
              type="text"
              name="customer_name"
              placeholder="e.g. Sarah Smith"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Customer Email</label>
            <input
              type="email"
              name="email"
              placeholder="sarah@example.com"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <span>Send Follow-Up Email</span>
            )}
          </button>
        </form>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
