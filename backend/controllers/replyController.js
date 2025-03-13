const { createReplyService, getThreadRepliesService } = require('../services/replyService');

exports.createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: threadId } = req.params;
    const userId = req.user.id;

    const replyWithUser = await createReplyService(userId, content, threadId);

    res.status(201).json(replyWithUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reply', details: error.message });
  }
};

exports.getThreadReplies = async (req, res) => {
  try {
    const { id: threadId } = req.params;

    const replies = await getThreadRepliesService(threadId);

    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get replies', details: error.message });
  }
};
