//asking app to listen on port 3306 - in the terminal it should say now listening on port 
//https://www.npmjs.com/package/dotenv 
//create a dotenv???? //install nodemon 

const port = process.env.PORT || 3306;

const express = require('express');
const app = express();


const fs=require('fs');
const path = require('path');

//test to see if everything is properly set up 
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })
  
//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })

