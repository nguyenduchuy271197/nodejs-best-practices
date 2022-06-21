const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error(
      //       "Password must contain at least one letter and one number"
      //     );
      //   }
      // },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

/**
 *
 * @param {string} email - The user's email
 * @returns {Promise <boolean>}
 */
UserSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
