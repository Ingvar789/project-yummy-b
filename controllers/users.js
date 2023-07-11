const { User } = require("../models/user");
const { HttpError, sendEmail, cloudinary } = require("../helpers");
const controlWrapper = require("../decorators/controllWrapper");
const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const fs = require("fs").promises;
const Jimp = require("jimp");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { BASE_URL } = process.env;
const { SECRET_KEY } = process.env;

const controllerRegister = async (req, res) => {
  const { email, password } = req.body;

  let avatarURL;
  // if avatar was sent
  if (req.file) {
    const { path: oldPath } = req.file;
    await Jimp.read(oldPath)
        .then((image) => {
          return image.resize(250, 250).write(oldPath);
        })
        .catch((e) => {
          throw HttpError(400, "Bad request");
        });

    const fileData = await cloudinary.uploader.upload(oldPath, {
      folder: "avatars",
    });
    await fs.unlink(oldPath);

    avatarURL = fileData.url;
  }
  // if avatar was not sent
  else {
    avatarURL = gravatar.url(email, { s: "250" });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken: verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<h1>Welcome to <span style="font-size:40px;">So Yummy</span> app!</h1>
     <p>Follow the link to complete the registration</p><a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"> Click to verify email </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const controllerVerifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  const payload = {
    id: user._id,
  };

  const token = sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    message: "Verification successful",
    token,
    verify: true,
    user: {
      email: user.email,
      subscription: user.subscription,
    }
  });
};

const controllerResendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<h1>Welcome to <span style="font-size:40px;">So Yummy</span> app!</h1>
     <h3 style="text-align: center; color: #ffffff;">Follow the link to complete the registration</h3><a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"> Click to verify your email </a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const controllerLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }
  const passwordCompare = await compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    verify: true,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const controllerLogout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const controllerGetCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const controllerUpdateSubscription = async (req, res) => {
  const { _id, subscription } = req.user;
  const { email } = req.body;

  if (subscription) {
    throw HttpError(404, "You are already subscribed");
  }

  const result = await User.findByIdAndUpdate(
    _id,
    { subscription: true },
    { new: true }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }

  const subscribedEmail = {
    to: email,
    subject: "Subscribed successfully",
    html: `<div style="background-color: #ADFF2F; text-align: center; padding: 20px;"><h1>Welcome to <span style="font-size:40px;">So Yummy</span> app!</h1> 
    <h5>You have successfully subscribed to the newsletter from our app. Thank you!</h5></div>`,
  };

  await sendEmail(subscribedEmail);

  res.status(200).json({ _id, email, subscription: result.subscription });
};

const controllerUpdateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath } = req.file;
  const fileData = await cloudinary.uploader.upload(oldPath, {
    folder: "avatars",
  });
  await fs.unlink(oldPath);

  await User.findByIdAndUpdate(_id, { avatarURL: fileData.url });
  res.json({
    avatarURL: fileData.url,
  });
};

module.exports = {
  controllerRegister: controlWrapper(controllerRegister),
  controllerLogin: controlWrapper(controllerLogin),
  controllerLogout: controlWrapper(controllerLogout),
  controllerGetCurrent: controlWrapper(controllerGetCurrent),
  controllerUpdateSubscription: controlWrapper(controllerUpdateSubscription),
  controllerUpdateAvatar: controlWrapper(controllerUpdateAvatar),
  controllerVerifyEmail: controlWrapper(controllerVerifyEmail),
  controllerResendVerifyEmail: controlWrapper(controllerResendVerifyEmail),
};
