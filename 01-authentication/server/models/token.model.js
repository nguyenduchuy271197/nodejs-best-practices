const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const TokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["REFRESH", "RESET_PASSWORD"],
      default: "REFRESH",
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
TokenSchema.plugin(toJSON);

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
