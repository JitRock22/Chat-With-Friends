const express=require('express');
const app=express();

require('./db/connection'); /*Imports the Database Connection */
const Users=require('./models/Users')/*Importing user model from UserSchema */

app.use(express.json());
app.use(express.urlencoded({extended:false}));
//Routes
app.get('/',(req,res)=>{
    res.send("Welcome");
})
app.post('api/register',async(req,res)=>{
    try{
        const{fullname,email,password}=req.body;
        if(!fullname||!email||!password){
            res.status(400).send('Please fill all required fields');
        }else{
            const prevUser=await Users.findOne({email});
            if(prevUser){
                res.status(400).send('User already exists');
            }else{
                const newUser= new Users({fullname, email})
            }
        }
    }catch(e){

    }
})
app.listen(port=3000,()=>{
    console.log("Server Running Successfully at port "+port);
})