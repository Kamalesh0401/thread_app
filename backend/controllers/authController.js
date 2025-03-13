const { registerUser, loginUser, generateToken } = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, email, password, bio, profilePicture } = req.body;

    if (!username)
      return res.status(400).json({ error: 'Registration failed', details: 'username is mandatory' });
    if (!email)
      return res.status(400).json({ error: 'Registration failed', details: 'email is mandatory' });
    if (!password)
      return res.status(400).json({ error: 'Registration failed', details: 'password is mandatory' });

    const user = await registerUser({ username, email, password, bio, profilePicture });

    const token = generateToken(user.id, '1hr');

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        createdAt: user.createdAt
      },
      token,
      message: "Register Successfully"
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser({ email, password });

    const token = generateToken(user.id, '1hr');

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        createdAt: user.createdAt
      },
      token,
      message: "Login Successfully"
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};
