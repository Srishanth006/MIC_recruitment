require('dotenv').config();
const express = require('express');
const server=express();
const portno=process.env.PORT || 3000;
const { getMusicDataFromMood, generateResponse } = require('./gemini.js');
const {tamilsongsacrdtomood,getSongsAndArtists}=require('./spotify.js');
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
    console.log('Successfully created playlist:',newplaylist.name);
    res.status(201).json(newplaylist);
    }catch(error){
        console.error("Error in /api/MIC route:",error);
        res.status(500).json({error:"Internal server error"});
    }

    });

server.listen(portno,()=>{
    console.log(`server started at port ${portno}`);
});