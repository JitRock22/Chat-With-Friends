const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, /*this means each account should be unique.
                         You can not open 2 accounts using same email address */
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    }
})
module.exports=mongoose.model("user",userSchema);