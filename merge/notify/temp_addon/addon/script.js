document.addEventListener('DOMContentLoaded', () => {
    const EMAILJS_SERVICE_ID = "service_rnzjj5j";
    const EMAILJS_TEMPLATE_ID = "template_hmd469v";
    // Public key is already initialized in index.html, but good to keep track

    const form = document.getElementById('email-form');
    const sendBtn = document.getElementById('send-btn');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // 1. Get Values
        const salespersonName = document.getElementById('salesperson_name').value.trim();
        const customerName = document.getElementById('customer_name').value.trim();
        const customerEmail = document.getElementById('customer_email').value.trim();

        // 2. Validate (Basic validation is handled by HTML 'required' and 'type=email', but we can add more if needed)
        if (!salespersonName || !customerName || !customerEmail) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        // 3. Prepare Template Params
        // IMPORTANT: We use the same names as the form inputs
        const templateParams = {
            salesperson_name: salespersonName,
            customer_name: customerName,
            email: customerEmail,          // MATCHED: Your dashboard uses {{email}} for the "To Email" field
            reply_to: customerEmail,       // Good practice to allow replying to customer
        };

        // 4. Send Email
        setLoading(true);
        hideStatus();

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showStatus('Email sent successfully!', 'success');
                form.reset();
            }, function (error) {
                console.log('FAILED...', error);
                // Show the specific error text to help debugging
                showStatus('Failed to send: ' + JSON.stringify(error), 'error');
            })
            .finally(function () {
                setLoading(false);
            });
    });

    // --- Helper Functions ---

    function setLoading(isLoading) {
        if (isLoading) {
            sendBtn.classList.add('loading');
            sendBtn.disabled = true;
        } else {
            sendBtn.classList.remove('loading');
            sendBtn.disabled = false;
        }
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
    }

    function hideStatus() {
        statusMessage.style.display = 'none';
        statusMessage.className = 'status-message';
    }
});
