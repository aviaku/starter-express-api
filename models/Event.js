const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { ObjectId } = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    images: {
      type: Array,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: ObjectId,
      ref: "Game",
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      // required: true,
    },
    numberOfTickets: {
      type: Number,
      required: true,
    },
    isAuctionTicket: {
      type: Boolean,
      default: false,
      // required: true,
    },
    description: {
      type: String,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
    gameInfo: {
      type: String,
    },
    eventMembers: [
      {
        amount: {
          type: Number,
        },
        image: {
          type: String,
        },
        user: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
        gameId: {
          type: String,
        },
        ranking: {
          type: Number, // Add this field to store rankings
          default: 0, // Initialize with 0
        },
      },
    ],
    disputes: [
      {
        raisedBy: {
          type: ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["donation", "ticket", "event_result", "event", "others"],
          default: "others",
        },
        status: {
          type: String,
          enum: ["open", "resolved", "closed"],
          default: "open",
        },
        message: {
          type: String,
        },
        image: {
          type: String,
        },
        createdAt: {
          type: Date,
        },
      },
    ],
    winner: {
      type: ObjectId,
      ref: "User",
    },
    rankingsScreenshotUrl: {
      type: String,
    },
    screenshotUploadedAt: {
      type: Date,
    },
    resultScreenshots: [
      {
        requestedBy: {
          type: String,
        },
        requestedAt: {
          type: Date,
        },
        imageUrl: {
          type: String,
        },
      },
    ],
    verified: {
      type: Boolean,
    },
    reUploadResult: {
      type: Boolean,
    },
    totalDonationReceived: {
      type: Number,
      default: 0,
    },
    percentageDivisionMode: {
      type: String,
      enum: ["different", "same", "ranking", "not_divided"],
      default: "not_divided", // Default to not dividing
    },
    eventMemberPercentages: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
    ],
    rankingPercentages: [
      {
        ranking: {
          type: Number,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
    ],
    donations: [
      {
        type: {
          type: String,
          enum: ["host", "player", "winner"],
          default: "host",
        },
        donationReceiver: {
          type: ObjectId,
          ref: "User",
        },
        amount: {
          type: Number,
        },
        image: {
          type: String,
        },
        message: {
          type: String,
        },
        user: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    bids: [
      {
        amount: {
          type: Number,
        },
        image: {
          type: String,
        },
        bidBy: {
          type: ObjectId,
          ref: "User",
        },
        gameId: {
          type: String,
        },
        bidAt: {
          type: Date,
          required: true,
        },
      },
    ],
    ratings: [{ type: ObjectId, ref: "Rating" }],
    eligibleBids: [
      {
        amount: {
          type: Number,
        },
        image: {
          type: String,
        },
        bidBy: {
          type: ObjectId,
          ref: "User",
        },
        bidAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Apply the pagination plugin
eventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Event", eventSchema);
