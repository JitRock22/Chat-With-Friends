const express = require('express');
const app = express();
const Promise = require("promise")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('./db/connection'); /*Imports the Database Connection */
const Users = require('./models/Users')/*Importing user model from UserSchema */
const Messages = require('./models/Messages');
const Conversations = require('./models/Conversations');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Routes
app.get('/', (req, res) => {
    res.send("Welcome");
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
                        return res.status(200).send('User Registration Successfull')

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
                    res.status(200).json({ user: { email: user.email, fullname: user.fullname }, token: user.token });
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
            return { user: { email: user.email, fullname: user.fullname }, conversationId: conversation._id }
        }))
        res.status(200).json({ conversationUserData });
    } catch (e) {
        console.log(e, "Error");
    }
})
app.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, message } = req.body;
        const newMessage = new Messages({ conversationId, senderId, message })
        await newMessage.save();
        res.status(200).send("message sent successfully");
    } catch (e) {
        console.log(e, "Error");
    }
})
app.get('/api/messages/:conversationId',async(req,res)=>{
    try{
        const conversationId=req.params.conversationId;
        const messages= await Messages.find({conversationId});
        res.status(200).json(messages);
    }catch(e){
        console.log(e,"Error");
    }
})
app.listen(port = 3000, () => {
    console.log("Server Running Successfully at port " + port);
})