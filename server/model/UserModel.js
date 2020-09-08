import { model, Schema } from "mongoose";
import { isEmail } from "validator";
import { hash, compare, genSalt } from "bcrypt";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Name !"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Email !"],
      validate: {
        validator: function (val) {
          return isEmail(val);
        },
        message: "Please Enter a valid Email Address",
      },
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please Enter Phone Number"],
      validate: {
        validator: function (val) {
          return String(val).length === 10 && String(val).charAt(0) > 6;
        },
        message: "Enter Valid Number",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      select: false,
    },

    confirmPassword: {
      type: String,
      required: [true, "Please Confirm Your Password"],
      select: false,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password Didn't match!",
      },
    },
    userRole: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },

    // if user found misleading account will be set to inactive instaed of deleting
    accountActive: {
      type: Boolean,
      default: true,
    },

    passwordModified: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Plugin to show Duplicate entries
userSchema.plugin(mongooseUniqueValidator);

userSchema.pre("save", async function () {
  const salt = await genSalt(12);
  const hashed = await hash(this.password, salt);
  this.password = hashed;
  this.confirmPassword = undefined;
});

userSchema.pre("find", function (next) {
  this.find({ accountActive: { $ne: false } });
  next();
});

// Decrypt Password
userSchema.methods.comparePassword = async function (
  inputPassword,
  dbStoredPassword
) {
  return await compare(inputPassword, dbStoredPassword);
};

export const User = model("User", userSchema);

// Seller Schema
const sellerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please Provide User ID"],
    unique: true,
  },
  warehouseLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

sellerSchema.index({ warehouseLocation: "2dsphere" });

sellerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    model: "User",
  });
});

sellerSchema.post("save", async function () {
  const user = await User.findByIdAndUpdate(
    this.userId,
    { userRole: "seller" },
    {
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: "query",
      new: true,
    }
  );
});

export const SellerModel = model("Seller", sellerSchema);
