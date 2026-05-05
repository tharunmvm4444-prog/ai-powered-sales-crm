const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['assigned', 'not assigned', 'completed'],
        default: 'not assigned'
    },
    assignedUser: {
        type: String,
        default: null
    },
    aiFeedback: {
        type: String,
        default: null
    },
    sentiment: {
        type: String,
        enum: ['positive', 'negative'],
        default: null
    },
    callDuration: {
        type: String,
        required: false,
        default: null
    },
    callDescription: {
        type: String,
        required: false,
        default: null
    },
    callSid: {
        type: String,
        default: null
    },
    extraAttributes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
