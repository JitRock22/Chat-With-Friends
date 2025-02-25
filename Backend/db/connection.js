const mongoose=require('mongoose');
const url = "mongodb+srv://Chat_App:Jit%40123@cluster0.ek6ge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("connected to DB")).catch((e)=>console.log('Error',e))