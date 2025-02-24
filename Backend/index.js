const express=require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.get('/',(req,res)=>{
    res.send("Welcome");
})
app.listen(3000,()=>{
    console.log("Server Running Successfully");
})