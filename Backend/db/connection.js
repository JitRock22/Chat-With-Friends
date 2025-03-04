require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("connected to DB")).catch((e) => console.log('Error', e))