const express = require('express');
const app = express();
const Promise = require("promise")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const io = require('socket.io')(3030, {
    cors: {
        origin: "http://localhost:5173",
    }
});

require('./db/connection'); /*Imports the Database Connection */
const Users = require('./models/Users')/*Importing user model from UserSchema */
const Messages = require('./models/Messages');
const Conversations = require('./models/Conversations');

//socket.io
let users = [];

io.on('connection', socket => {
    console.log("User Connected", socket.id);

    socket.on('addUser', async (userId) => {
        const existingUserIndex = users.findIndex(user => user.userId === userId);

        if (existingUserIndex === -1) {
            // User does not exist, add them
            const user = { userId, socketId: socket.id };
            users.push(user);
        } else {
            // User exists, update their socket ID
            users[existingUserIndex].socketId = socket.id;
        }

        io.emit('getUsers', users);
        console.log(users);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId, message, conversationId, receiverId,
                user: { id: user._id, email: user.email, fullname: user.fullname }
            });
        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId, message, conversationId, receiverId,
                user: { id: user._id, email: user.email, fullname: user.fullname }
            });
        }
    });


    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.socketId === socket.id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            io.emit('getUsers', users);
            console.log("User disconnected, users:", users);
        }
    });

    console.log(users);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//Routes
app.get('/', (req, res) => {
    res.send("Welcome to our Chat API");
})
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            res.status(400).send('Please fill all required fields');
        } else {
            const prevUser = await Users.findOne({ email });
            if (prevUser) {
                res.status(400).send('User already exists');
            } else {
                const newUser = new Users({ fullname, email })
                bcrypt.hash(password, 10, async (err, hash) => {
                    newUser.password = hash;
                    try {
                        await newUser.save();
                        return res.status(200).send("User Registered Successfully")

                    } catch (e) {
                        console.error("Error saving user:", e);
                        return res.status(500).send("Error saving user to database");
                    }
                })


            }
        }
    } catch (e) {
        console.log("This error: ", e);
    }
})
app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send('Please Fill all required fields');
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send("User email or password is incorrect");
            } else {
                const validateuser = await bcrypt.compare(password, user.password);
                if (!validateuser) {
                    res.status(400).send("User email or password is incorrect");
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'This is SECRET'
                    let token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        await user.save();
                        next();
                    })
                    // console.log(user.token,"token");
                    res.status(200).json({ user: { id: user._id, email: user.email, fullname: user.fullname }, token: user.token });
                }
            }
        }
    } catch (e) {

    }
})
app.post('/api/conversation', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newconversation = new Conversations({ members: [senderId, receiverId] });
        await newconversation.save();
        res.status(200).send('Conversation created sucessfully');
    } catch (e) {
        console.log(e, "Error");
    }
})
app.get('/api/conversation/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        const conversationUserData = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { receiverId: user._id, email: user.email, fullname: user.fullname }, conversationId: conversation._id }
        }))
        res.status(200).json({ conversationUserData });
    } catch (e) {
        console.log(e, "Error");
    }
})
app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).send("Please fill all field jit da")
        if (conversationId === 'new' && receiverId) {
            const newconversation = new Conversations({ members: [senderId, receiverId] });
            await newconversation.save();
            const newMessage = new Messages({ conversationId: newconversation._id, senderId, message })
            await newMessage.save();
            res.status(200).send("message sent successfully");
        } else if (!conversationId && !receiverId) {
            return res.status(400).send("Please fill all fields")
        }
        const newMessage = new Messages({ conversationId, senderId, message })
        await newMessage.save();
        res.status(200).send("message sent successfully");
    } catch (e) {
        console.log(e, "Error");
    }
})
app.get('/api/messages/:conversationId', async (req, res) => {
    try {
        const checkMessages = async (conversationId) => {
            const messages = await Messages.find({ conversationId });
            const messageUserData = Promise.all(messages.map(async (message) => {
                const user = await Users.findById(message.senderId);
                return { user: { id: user._id, email: user.email, fullname: user.fullname }, message: message.message };
            }))
            res.status(200).json(await messageUserData);
        }
        const conversationId = req.params.conversationId;
        if (conversationId === 'new') {
            const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } })
            if (checkConversation.length > 0) {
                checkMessages(checkConversation[0]._id)
            } else {
                return res.status(200).json([]);
            }
        } else {
            checkMessages(conversationId)
        }
    } catch (e) {
        console.log(e, "Error");
    }
})
app.get('/api/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } })
        const userData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullname: user.fullname, receiverId: user._id } }
        }))
        res.status(200).json(await userData);
    } catch (e) {
        console.log('Error', error);
    }
})
app.listen(port = 3000, () => {
    console.log("Server Running Successfully at port " + port);
})