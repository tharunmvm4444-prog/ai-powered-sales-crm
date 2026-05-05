const mongoose = require("mongoose");

const AllowedSalespersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("AllowedSalesperson", AllowedSalespersonSchema);
