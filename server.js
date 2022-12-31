
//import modules; 
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const util = require("util");

//set up server 
const PORT = process.env.PORT || 3306;


// building scalable and highly responsive applications
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


//. This middleware  parses the req.body and adds the resulting object as a property of the req.object. This helps the computer program to process and understand the information sent to site. It helps the program understand the structore and what each part means which can be used to add into the database.
//setting up routes to recognize response as a JSON. 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//use the express.static middleware to serve static files 
app.use(express.static(path.join(__dirname, "./develop/public")));

//Static Middleware to check if the requested resource is availaible in the public folder. 
app.use(express.static("./develop/public"));


// API Routes | "GET" request - read content of file and parse it as JSON. Then stores the data in the 'notes' variable and sends it back to the client using the 'res.json' function. 
app.get("/api/notes", function (req, res) {
    readFileAsync("./develop/db/db.json", "utf8").then(function (data) {
        //stores the data in the notes variable and sends it back to the client using 'res.json' function
        notes = [].concat(JSON.parse(data))
        //sets the response body to the provided data and set the content type to "application/json"
        res.json(notes);
    })

});

//API Route | "POST" request- when a client sends a POST request to this endpoint the server will read the database and push 
app.post("/api/notes", function (req, res) {
    // set the new note as the request body
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf8")
        .then(function (data) {
            //add note to whats already existed 
            const notes = [].concat(JSON.parse(data))
            notes.id = uuid4();//generates a unique identifieer for the note
            //add the new note to the array of notes 
            notes.push(note);
            return notes;
        })
        .then(function (notes) {
            // send a response to the client indicating that the operation was successful 
            return writeFileAsync("./develop/db/db.json", JSON.stringify(notes));
        })
        .catch(function (err) {
            // if there was an error reading the file or writing to, send a response to the client indicating the operation failed 
            res.sendStatus(500)
        })

});

// Steps for deleting a note 
//API Route | detelete request. 
app.delete("/api/notes/:id", async function (req, res) {
    try {
        //validates the id parameter
        const id = req.params.id;
        if (!id || typeof id !== 'string') {
            return res.status(400).send({error: 'Invalid id parameter'});
        }
        // Read the notes from the file 
        const data = await readFileAsync("./develop/db/db.json","utf8")
        const notes = JSON.parse(data);
        
        // Remove the note with the specified id from the array 
        const updatedNotes = notes.filter(function(note) {
            return note.id !==id;
        }); 

        //write the updated notes to the file 
        await writeFileAsync("./develop/db/db.json", JSON.stringify(updatedNotes)); 

        // Send a response to the client indicating that the oepration was successful 
        res.sendStatus(200);
    } catch(error) {
        //handle any error that might occur 
        console.error(error);
        res.sendStatus(500);
    }
    });



// HTML Routes 
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});

//listening on `PORT` environment. 
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT); 
}).on("error", console.error);
