const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    text: true,
  },
  picture: {
    type: String,
    trim: true,
    default:
      "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  numberOfPlayers: {
    type: Number,
    required: true,
  },
  Gamers: [
    {
      user: {
        type: ObjectId,
        ref: "User",
      },
      savedAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Game", gameSchema);
