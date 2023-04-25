const express = require('express');
const mongoose = require('mongoose');
const multer=require("multer")
const app = express();

app.use(multer().any());
app.use(express.json());

mongoose.connect("mongodb+srv://prayag:prayag123@cluster0.0np0qlj.mongodb.net/Assignment?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use(require('./routes/routes.js'));

app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});