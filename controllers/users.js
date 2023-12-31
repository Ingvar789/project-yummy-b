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
    html: `<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>So Yummy Email Vefification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0;">
 <table  border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
   <td>
    <table style="border-collapse: collapse;"  border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px">
   <tbody>
     <tr>
    <td align="center" bgcolor="#8BAA36" style="padding: 0px; font-family: Poppins;">
      <h2 style="font-weight: 600; font-size: 32px; line-height: 1; color: #fafafa">So Yummy</h2>
    </td>
  </tr>
  <tr>
    <td bgcolor="#FAFAFA" style="padding: 20px 30px 20px 30px; font-family: Poppins; font-weight: 600; background-image: url('https://res.cloudinary.com/dcmnkrdst/image/upload/v1689614787/email-images/qa40f3rh2wylnompmzeq.png'); background-attachment: local; background-position: 0 0;  background-size: 600px; background-repeat: no-repeat;">
      <table  border="0" cellpadding="0" cellspacing="0" width="100%">
     <tr>
    <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px;">
      <img width="100" style="display: block;" alt="" src="https://res.cloudinary.com/dcmnkrdst/image/upload/v1689614787/email-images/kn397glmhnrthqthkk0i.svg">
    </td>
     </tr>
     <tr>
       <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px; line-height: 1.6">
      <p>Welcome to the "So Yummy" app!</p>
      <p>To be in the application, please follow the link below.</p>
      <p>If you have not registered in our application, please ignore this letter!</p>
    </td>
     </tr>
          <tr>
       <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px;">
      <p><a href="https://basesnel.github.io/project-yummy-f/signin?verify=${verificationToken}" style="color: #f5f5f5; text-decoration: none; padding: 8px 16px; box-shadow: 0px 5px 10px 0px rgba(34, 37, 42, 0.3), 0px -5px 10px 0px rgba(34, 37, 42,  0.3); border-radius: 8px; background-color: #8BAA36">Verify your mail.</a></p>
    </td>
     </tr>
   </table>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#22252A" color="#fafafa" style="padding: 10px 30px 10px 30px; font-family: Poppins;">
      <table  border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
       <td><p style="color: #fafafa">So Yummy Company</td>
    <td align="right"><p style="color: #fafafa">The best recipes</p></td>
     </tr>
   </table>
    </td>
  </tr>
   </tbody>
 </table>
   </td>
  </tr>
 </table>
</body>
</html>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
      verificationToken: newUser.verificationToken,
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

  const verifiedUser = await User.findById(user._id);

  res.status(200).json({
    message: "Verification successful",
    token: verifiedUser.token,
    verify: verifiedUser.verify,
    user: {
      name: verifiedUser.name,
      avatarURL: verifiedUser.avatarURL,
      email: verifiedUser.email,
      subscription: verifiedUser.subscription,
    },
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
    html: `<h1>Welcome to <span style="font-size:40px; font-style: italic;">"So Yummy"</span> app!</h1>
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

  const verifiedUser = await User.findById(user._id);

  res.status(200).json({
    token: verifiedUser.token,
    verify: verifiedUser.verify,
    user: {
      _id: verifiedUser._id,
      email: verifiedUser.email,
      subscription: verifiedUser.subscription,
      name: verifiedUser.name,
      avatarURL: verifiedUser.avatarURL,
    },
  });
};

const controllerLogout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const controllerGetCurrent = async (req, res) => {
  const { _id, email, subscription, name, avatarURL, token } = req.user;
  res.json({
    _id: _id,
    token,
    email,
    subscription,
    name,
    avatarURL,
  });
};

const controllerUpdateSubscription = async (req, res) => {
  const { _id, subscription } = req.user;
  const { email } = req.body;

  if (subscription !== "") {
    throw HttpError(404, "You are already subscribed");
  }

  const result = await User.findByIdAndUpdate(_id, { subscription: email });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  const subscribedEmail = {
    to: email,
    subject: "Subscribed successfully",
    html: `<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>So Yummy subscription</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0;">
 <table  border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
   <td>
    <table style="border-collapse: collapse;"  border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px">
   <tbody>
     <tr>
    <td align="center" bgcolor="#8BAA36" style="padding: 0px; font-family: Poppins;">
      <h2 style="font-weight: 600; font-size: 32px; line-height: 1; color: #fafafa">So Yummy</h2>
    </td>
  </tr>
  <tr>
    <td bgcolor="#FAFAFA" style="padding: 20px 30px 20px 30px; font-family: Poppins; font-weight: 600; background-image: url('https://res.cloudinary.com/dcmnkrdst/image/upload/v1689614787/email-images/qa40f3rh2wylnompmzeq.png'); background-attachment: local; background-position: 0 0;  background-size: 600px; background-repeat: no-repeat;">
      <table  border="0" cellpadding="0" cellspacing="0" width="100%">
     <tr>
    <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px;">
      <img width="100" style="display: block;" alt="" src="https://res.cloudinary.com/dcmnkrdst/image/upload/v1689614787/email-images/kn397glmhnrthqthkk0i.svg">
    </td>
     </tr>
     <tr>
       <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px; line-height: 1.6">
      <p>Welcome to the "So Yummy" app!</p>
      <p>Thank you for your interest in our app and your willingness to subscribe to our newsletter! </p>
      <p>We truly appreciate your support and are excited to keep you updated with the latest news, recipes, and helpful tips for cooking delicious dishes.</p>
    </td>
     </tr>
          <tr>
       <td align="center" bgcolor="transparent" style="padding: 10px 0px 10px 0px;">
      <p>Thank you for choosing our app. Together, we create the most delightful culinary moments!</p>
    </td>
     </tr>
     <tr>
          <td align="right" bgcolor="transparent" style="padding: 10px 0px 10px 0px;">
            <p>Best regards, So Yummy team</p>
          </td>
        </tr>
   </table>
    </td>
  </tr>
  <tr>
    <td align="center" bgcolor="#22252A" color="#fafafa" style="padding: 10px 30px 10px 30px; font-family: Poppins;">
      <table  border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
       <td><p style="color: #fafafa">So Yummy Company</td>
    <td align="right"><p style="color: #fafafa">The best recipes</p></td>
     </tr>
   </table>
    </td>
  </tr>
   </tbody>
 </table>
   </td>
  </tr>
 </table>
</body>
</html>`,
  };

  await sendEmail(subscribedEmail);

  const updatedSubscription = await User.findById(_id);

  res.status(200).json({ subscription: updatedSubscription.subscription });
};

const controllerUpdateUser = async (req, res) => {
  const updateData = req.body;
  const avatar = req.file;

  try {
    const { _id } = req.user;

    if (avatar) {
      const { path: oldPath } = avatar;
      const fileData = await cloudinary.uploader.upload(oldPath, {
        folder: "avatars",
      });
      await fs.unlink(oldPath);
      await User.findByIdAndUpdate(_id, { avatarURL: fileData.url });
    }

    if (updateData.name) {
      await User.findByIdAndUpdate(_id, { name: updateData.name });
    }

    const updateUser = await User.findById(_id);

    res.json(updateUser);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};

const controllerGetShoppingList = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).populate("shoppingList.id");

  res.json(user.shoppingList);
};

const controllerUpdateIngredientToShoppingList = async (req, res) => {
  const { _id, shoppingList } = req.user;
  const { id, measure, recipeId } = req.body;

  const existsInShoppingList = shoppingList.some(
    (item) => item.id === id && item.recipeId === recipeId.toString()
  );

  if (existsInShoppingList) {
    await User.findByIdAndUpdate(_id, {
      $pull: {
        shoppingList: { id, recipeId },
      },
    });
    res.json({ message: "The ingredient is delete to the shopping list" });
  } else {
    await User.findByIdAndUpdate(
      _id,
      {
        $push: { shoppingList: { id, measure, recipeId: recipeId.toString() } },
      },
      { new: true }
    );
    res.json({ message: "The ingredient is added to the shopping list" });
  }
};

module.exports = {
  controllerRegister: controlWrapper(controllerRegister),
  controllerLogin: controlWrapper(controllerLogin),
  controllerLogout: controlWrapper(controllerLogout),
  controllerGetCurrent: controlWrapper(controllerGetCurrent),
  controllerUpdateSubscription: controlWrapper(controllerUpdateSubscription),
  controllerUpdateUser: controlWrapper(controllerUpdateUser),
  controllerVerifyEmail: controlWrapper(controllerVerifyEmail),
  controllerResendVerifyEmail: controlWrapper(controllerResendVerifyEmail),
  controllerGetShoppingList: controlWrapper(controllerGetShoppingList),
  controllerUpdateIngredientToShoppingList: controlWrapper(
    controllerUpdateIngredientToShoppingList
  ),
};
