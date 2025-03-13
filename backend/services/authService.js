const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const registerUser = async ({ username, email, password, bio, profilePicture }) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });

  if (existingUser) {
    throw new Error('Email or username already in use');
  }

  const user = await User.create({
    username,
    email,
    password,
    bio,
    profilePicture
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const generateToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = {
  registerUser,
  loginUser,
  generateToken
};
