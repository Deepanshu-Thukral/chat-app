
const User = require("../model/userModel");
const bcrypt = require('bcrypt');

module.exports.register = async(req, res, next) => {
    try {
        console.log("Going to server");
    console.log(req.body);

    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


module.exports.login = async(req, res, next) => {
  try {
      console.log("Going to login connection");
  console.log(req.body);

  const { username,password } = req.body;
  const user = await User.findOne({ username });
  if (!user)
      return res.json({ msg: "Username not found!!", status: false });
    
  const isPassword=await bcrypt.compare(password,user.password)
    if (!isPassword) {
      return res.json({ msg: "Wrong Password!!!" ,User});
    }
    delete user.password;
    
  return res.json({ status: true, user });
} catch (ex) {
  next(ex);
}
};

module.exports.setAvatar = async(req, res, next) => {
  try {
    // console.log("Request for setting Avatar is coming");
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage
    }
    );
    return res.json({isSet:userData.isAvatarImageSet,image:userData.avatarImage})
  }
  catch(error) {
    console.log(error);
  }
}
module.exports.getAllUsers = async(req, res, next) => {
  try {
    console.log("Request is coming.");
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id"
    ]);
    // console.log(users);
    console.log("all users is working in userController.");
    return res.json(users);

  }
  catch(error) {
    console.log(error)
  }
}

