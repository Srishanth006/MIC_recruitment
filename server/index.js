const express = require('express');
const server=express();
const portno=process.env.PORT || 3000;
server.listen(portno,()=>{
    console.log(`server started at port ${portno}`);
});