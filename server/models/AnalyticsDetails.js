const mongoose = require("mongoose");

const analyticsDetailsSchema = new mongoose.Schema(
  {
    period: {
      type: String, // e.g. "2024-09"
      required: true,
      index: true,
    },

    // ===== Average Calls Per Day =====
    callsPerDay: [
      {
        day: String,        // Monday, Tuesday...
        answered: Number,
        notAnswered: Number,
        canceled: Number,
        busy: Number,
      },
    ],

    // ===== Average Calls Per Hour =====
    callsPerHour: [
      {
        hour: String,       // "00:00", "03:00"
        answered: Number,
        notAnswered: Number,
        canceled: Number,
        busy: Number,
      },
    ],

    // ===== Average Call Duration (City-wise) =====
    avgCallDuration: [
      {
        city: String,
        duration: Number,   // minutes
      },
    ],

    // ===== Calls by Brand (Weekly totals) =====
    callsByBrandWeek: [
      {
        weekLabel: String,  // Week 1 / Mon–Sun
        Boston: Number,
        Chicago: Number,
        Washington: Number,
        LosAngeles: Number,
        NewYork: Number,
        SanFrancisco: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AnalyticsDetails",
  analyticsDetailsSchema
);
