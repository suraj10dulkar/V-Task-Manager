var express = require("express");
var mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://suraj9869:NnY3wkqdVJBkmJWR@cluster0.cvcu4k5.mongodb.net/todoapp?retryWrites=true&w=majority";

var databaseName = "todoapp";
var database;

app.listen(3001, () => {
    mongoclient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("Error connecting to MongoDB:", error);
            return;
        }
        if (!client) {
            console.error("MongoDB client is undefined.");
            return;
        }
        database = client.db(databaseName);
        console.log("MongoDB Connected Successfully!!");
    });
});

app.get("/api/todoapp/getnotes",(request,response)=>{
    database.collection("todoappcollection").find({}).toArray((error,result)=>{
        response.send(result)
    })
})

app.post('/api/todoapp/AddNotes', multer().none(), (request, response)=>{
    database.collection("todoappcollection").count({},function(error, numOfDocs) {
        database.collection("todoappcollection").insertOne({
            id: (numOfDocs+1).toString(),
            description: request.body.newNotes,
            status:request.body.status,
            date_time:request.body.date_time
        })
    })
})

app.delete("/api/todoapp/deleteNotes",(request,response)=>{
    database.collection("todoappcollection").deleteOne({
        id:request.query.id
    })
    response.json("Data Deleted")
})