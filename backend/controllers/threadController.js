const threadService = require('../services/threadService');

exports.createThread = async (req, res) => {
  try {
    const { content } = req.body;
    const thread = await threadService.createThread(content, req.user.id);
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllThreads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await threadService.getAllThreads(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getThread = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await threadService.getThread(id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteThread = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await threadService.deleteThread(id, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPopularThreads = async (req, res) => {
  try {
    const threads = await threadService.getPopularThreads();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
