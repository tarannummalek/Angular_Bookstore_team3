const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config.json');
const app = express();

app.use(express.json());
app.use(cors());

const url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=valtech`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected!'))
  .catch((err) => console.log('Error when connecting database:', err));

// const commentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
const Comment = mongoose.model(
    "Comment",
    new schema({
      bookId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Books' },
      author: { type: String, default: 'Anonymous' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    })
  );
  
let objectId = mongoose.Schema.ObjectId;
let schema = mongoose.Schema;

//Schema Add below
//for user detail -- schema name --> users


let Books = mongoose.model(
    "Books",
    new schema({
        id: objectId,
        title: { type: String, required: true },
        author: { type: String, required: true },
        publicationDate: Date,
        price: { type: Number, required: true },
        description: String,
        coverImage: Buffer,
        coverImageType: String,
        isbn: String,
        genre: [String],
        pageCount: Number,
        publisher: String,
        language: String,
        keywords: [String],
        pdf: Buffer,
        pdfType: String
    })
);


// const Book = mongoose.model('Book', bookSchema);

app.get('/books/:id', (req, res) => {
  Books.findById(req.params.id)
    .then((book) => {
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.json(book);
    })
    .catch((err) => res.status(500).json({ error: 'Failed to fetch book', err }));
});
// Get comments for a book
app.get('/books/:id/comments', (req, res) => {
    Comment.find({ bookId: req.params.id }).sort({ createdAt: -1 })
      .then(comments => res.json(comments))
      .catch(err => res.status(500).json({ error: 'Failed to fetch comments', err }));
  });
  
  // Post a comment for a book
  app.post('/books/:id/comments', (req, res) => {
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
  
    const newComment = new Comment({
      bookId: req.params.id,
      author: author || 'Anonymous',
      text
    });
  
    newComment.save()
      .then(comment => res.status(201).json(comment))
      .catch(err => res.status(500).json({ error: 'Failed to post comment', err }));
  });
  

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
