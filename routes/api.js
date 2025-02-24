'use strict';
const Book = require('./models.js').Book;
module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      let b = await Book.find()
      res.json(b)
    })

    .post((req, res) => {
      if (req.body.title === "") return res.json('missing required field title')
      let book = new Book(req.body)
      book.save().then(doc => res.json(doc)).catch(err => res.json('missing required field title'))
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany()
      res.json('complete delete successful')
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let b = await Book.findById(bookid)
        res.json({ _id: b._id, title: b.title, comments: b.comments ? b.comments : [] })
      } catch (err) {
        res.json('no book exists')
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (comment) {
        try {
          let b = await Book.findById(bookid)
          b.comments.push(comment)
          b.commentcount = b.comments.length
          await b.save()
          res.json({ _id: b._id, title: b.title, comments: b.comments ? b.comments : [] })
        } catch (err) {
          res.json('no book exists')
        }
      } else {
        res.json('missing required field comment')
      }
    })

    .delete(async (req, res) => {
      try {
        let b = await Book.findByIdAndRemove(req.params.id)
        if (b) {
          res.json('delete successful')
        } else {
          res.json('no book exists')
        }
      } catch (err) {
        res.json('no book exists')
      }
    });
 
};
