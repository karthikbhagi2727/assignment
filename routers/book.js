const express = require("express");
const Book = require("../models/book")
const app = express()


app.post("/insert",async (req,res) => {
    try {
        const book = await Book.create(req.body)
        res.status(201).json({ success : true, message : book })
    } catch (error) {
        res.status(500).json({ success: true, message: error})
    }
})

app.get("/byauthor/:author",async(req,res) => {
    try {
        const data = req.params.author;
        const search = data.split("&")
        const findBooks = await Book.aggregate([
            { $match: { $or: [{ author: search[0] }, { author: search[1] }] } }
        ])
        res.status(200).json(findBooks)
    } catch (error) {
        res.send(error)
    }
})

app.get("/allBooks/:author",async (req,res) => {
    try {
        const data = req.params.author;
        const search = data.split("&")
        const findBooks = await Book.aggregate([
            { $match: { $and: [{ author: search[0] }, { author: search[1] }] } }
        ])
        res.status(201).json({ success: true, message: findBooks })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.get("/findbook/:year", async (req, res) => {
    try {
        const findBooks = await Book.find({ publishedAt : req.params.year })
        res.status(201).json({ success: true, message: findBooks })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.get("/allBooksByCost", async (req, res) => {
    try {
        const findBooks = await Book.find({ cost : { $gte: 100, $lte: 500 } });
        res.status(201).json({ success: true, message: findBooks })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.get("/avgCost", async (req, res) => {
    try {
        const avgBooks = await Book.aggregate([
            { $match : {} },
            { $group: { _id: "_id", count: { $avg: "$cost" } } },
        ])
        res.status(201).json({ success: true, message: avgBooks })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.post("/updateCost", async (req, res) => {
    try {
        const update = await Book.find({ category : req.body.category })

        update.map(async (val) => {
            var UpdateCost = val.cost + 100
            await Book.findByIdAndUpdate({ _id: val._id }, { cost: UpdateCost},{ new : true })
        })

        res.status(200).json({ success: true, message: "updated cost" })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.delete("/delete", async (req,res) => {
    try {
        const deleteBook = await Book.findOneAndDelete({ title: req.body.title })
        res.status(200).json({ success: true, message: deleteBook })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})

app.post("/update/:id",async (req,res) => {
    try {
        const update = await Book.findByIdAndUpdate({ _id : req.params.id }, req.body , { new : true })
        res.status(201).json({ success: true, message: update })
    } catch (error) {
        res.status(500).json({ success: true, message: error })
    }
})



module.exports = app;