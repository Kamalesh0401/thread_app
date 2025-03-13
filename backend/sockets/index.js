const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return next(new Error('Authentication failed'));
            }

            socket.user = {
                id: user.id,
                username: user.username
            }
            next();

        }
        catch (error) {
            next(new Error('Invalid authentication token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        socket.join(`user:${socket.user.id}`);

        socket.on('joinThread', (threadId) => {
            socket.join(`thread:${threadId}`);
        });


        socket.on('leaveThread', (threadId) => {
            socket.leave(`thread:${threadId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.username}`);
        });
    });

    return io;
};

module.exports = setupSocket;