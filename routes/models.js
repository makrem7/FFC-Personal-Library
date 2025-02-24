const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//https://personal-library.freecodecamp.rocks/api/books
//{"_id":"6448f358b7ffbc084097b219","title":"Moby Dick"}
const Book = mongoose.model(
  "book",
  new Schema(
    {
      title:    { type: String, required: true },
      comments: [String],
      commentcount: {type: Number, default: 0}
    },
    {     
      versionKey: false
    }
  )
);
//https://personal-library.freecodecamp.rocks/api/books/6448f358b7ffbc084097b219
//{"comments":["Caca","perro"],"_id":"6448f358b7ffbc084097b219","title":"Moby Dick","commentcount":2,"__v":2}

//response will be array of book objects
//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

exports.Book = Book;
