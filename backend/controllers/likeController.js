const { likeThreadService, likeReplyService } = require('../services/likeService');

exports.likeThread = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const result = await likeThreadService(userId, threadId);

    res.json({ message: result.message, liked: result.liked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like thread', details: error.message });
  }
};

exports.likeReply = async (req, res) => {
  try {
    const { id: replyId } = req.params;
    const userId = req.user.id;

    const result = await likeReplyService(userId, replyId);

    res.json({ message: result.message, liked: result.liked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like reply', details: error.message });
  }
};
