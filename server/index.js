require('dotenv').config();
const express = require('express');
const server=express();
const portno=process.env.PORT || 3000;
app.use(express.json());
app.post('api/MIC',(req,res)=>{
    const{mood}=req.body;
    if(!mood){
        return res.status(400).json({error:"Mood is required"});
    }
    console.log('Mood fetched:',mood);
    res.status(200).json({message:'Mood received successfully',mood:mood});
});
console.log('Mood fetched:',mood);

server.listen(portno,()=>{
    console.log(`server started at port ${portno}`);
});