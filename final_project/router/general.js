const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({message:"Username and password required"})
    }
    const userExist = users.find(user=>user.username === username);
    if(userExist){
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({username,password});
    return res.status(200).json({ message: "User registered successfully" });
});

public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books))
});

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn]
    if(!book){
        return res.status(404).json({message:"Book not found"});
    }
    return res.status(200).json(JSON.stringify(book));
});
  
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const result = [];

    console.log(author,"<====AUTHOR")

    for(let key in books){
        if(books[key].author === author){
            result.push(books[key]);
        }
    }
    if (result.length === 0) {
        return res.status(404).json({ message: "Author not found" });
    }
    return res.status(200).json(JSON.stringify(result));
});

public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const result = [];
    for(let key in books){
        if(books[key].title===title){
            result.push(books[key]);
        }
    }
    if (result.length === 0) {
        return res.status(404).json({ message: "Title not found" });
    }
    return res.status(200).json(JSON.stringify(result));
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;