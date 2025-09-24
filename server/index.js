const { getMusicDataFromMood, generateResponse } = require('./gemini');
const {tamilsongsacrdtomood,getSongsAndArtists}=require('./spotify');
require('dotenv').config();
const express = require('express');
const server=express();
const portno=process.env.PORT || 3000;
server.use(express.json());
server.post('/api/MIC',async(req,res)=>{
    const{mood}=req.body;
    if(!mood){
        return res.status(400).json({error:"Mood is required"});
    }try{
console.log('Mood fetched:',mood);
    const musicData=await generateResponse(mood);
    console.log('Music data:',musicData);
    console.log('Creating playlist');
    const newplaylist=await getSongsAndArtists(mood,musicData); 
    res.status(201).json(musicData);
    }catch(error){
        console.error("Error in /api/MIC route:",error);
        res.status(500).json({error:"Internal server error"});
    }

    });

server.listen(portno,()=>{
    console.log(`server started at port ${portno}`);
});