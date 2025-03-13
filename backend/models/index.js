const sequelize = require('../config/database');
const User = require('./User');
const Thread = require('./Thread');
const Reply = require('./Reply');
const Like = require('./Like');
const Notification = require('./Notification');

User.hasMany(Thread);
Thread.belongsTo(User);

User.hasMany(Reply);
Reply.belongsTo(User);

Thread.hasMany(Reply);
Reply.belongsTo(Thread);

User.hasMany(Like);
Like.belongsTo(User);

User.hasMany(Notification, { as: 'Notifications' });
Notification.belongsTo(User);
Notification.hasOne(Reply, {
  foreignKey: 'id',
  as: 'Reply',
  sourceKey: 'sourceId'
});
Notification.hasOne(Like, {
  foreignKey: 'id',
  as: 'Like',
  sourceKey: 'sourceId'
});

Reply.belongsTo(Thread, { foreignKey: 'ThreadId', as: 'ReplyThread' }); 
Like.belongsTo(Thread, { foreignKey: 'itemId', as: 'LikeThread' }); 

module.exports = {
  sequelize,
  User,
  Thread,
  Reply,
  Like,
  Notification,
};