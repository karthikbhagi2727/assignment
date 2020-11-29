const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://karthik:karthik2511@cluster0.2efze.mongodb.net/bookslist?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  }).then(() => {
    console.log("connectd to db")
}).catch((err) => {
    console.log(err)
})

module.exports = mongoose;