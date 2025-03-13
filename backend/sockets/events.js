let io;

const initialize = (socketIo) => {
  io = socketIo;
};

const emitNewReply = (threadId, reply) => {
  if (!io) return;
  io.to(`thread:${threadId}`).emit('newReply', reply);
};

const emitReplyUpdated = (threadId, reply) => {
  if (!io) return;
  io.to(`thread:${threadId}`).emit('replyUpdated', reply);
};

const emitNewNotification = (userId, notification) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('newNotification', notification);
};

const emitNewMention = (userId, mention) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('newMention', mention);
};

module.exports = {
  initialize,
  emitNewReply,
  emitReplyUpdated,
  emitNewNotification,
  emitNewMention
};