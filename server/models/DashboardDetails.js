const mongoose = require("mongoose");

const dashboardDetailsSchema = new mongoose.Schema(
  {
    // Optional: link to manager
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Time period this dashboard represents
    period: {
      type: String, // e.g. "2024-09", "2024-Q3"
      required: true,
    },

    totalCalls: {
      value: {
        type: Number,
        required: true,
      },
      changePercent: {
        type: Number, // +203, -10, etc
        required: true,
      },
    },

    totalMinutes: {
      value: {
        type: Number,
        required: true,
      },
      changePercent: {
        type: Number,
        required: true,
      },
    },

    avgCallDuration: {
      value: {
        type: Number, // minutes (2.9)
        required: true,
      },
      changePercent: {
        type: Number,
        required: true,
      },
    },

    uniqueCallers: {
      value: {
        type: Number,
        required: true,
      },
      changePercent: {
        type: Number,
        required: true,
      },
    },

    newCallers: {
      value: {
        type: Number,
        required: true,
      },
      changePercent: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model(
  "DashboardDetails",
  dashboardDetailsSchema
);
