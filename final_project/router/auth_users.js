const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "admin", password: "admin123" },
    { username: "john", password: "john123" },
    { username: "alice", password: "alice123" },
    { username: "roshan", password: "roshan123" }
  ];
  
const isValid = (username) => {
    return users.find(user => user.username === username) ? true : false;
}

const authenticatedUser = (username, password) => {
    return users.find(
        user => user.username === username && user.password === password
    ) ? true : false;
}

regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;
  if(!username || !password){
     return res.status(400).json({message:"Username/password are mandatory"});
}
  if(!isValid(username)){
    return res.status(401).json({message:"not a valid user"});
  }
  if(!authenticatedUser(username,password)){
    return res.status(401).json({message:"not Authenticated"});
  }
  const token = jwt.sign({username},"fingerprint_customer");
  req.session.authorization = { token }
  return res.status(200).json({message: "User login successfully",token});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username
    let isbn = req.params.isbn
    const review = req.query.review;
    if(!books[isbn]){
        return res.status(404).json({message: "Book does not exist"});
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({
        message: "Review updated",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req,res) =>{
    const username = req.user.username
    let isbn = req.params.isbn
    if(!books[isbn]){
        return res.status(404).json({message: "Book does not exist"});
    }
    delete books[isbn].reviews[username]
    return res.status(200).json({
        message: "Review Deleted"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;