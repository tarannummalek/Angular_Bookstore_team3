const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config.json');
const app = express();

app.use(express.json());
app.use(cors());

let url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=valtech`;

mongoose.connect(url)
    .then(res => console.log("Database Connected !!"))
    .catch(err => console.log("Error when connecting database :", err));

const Schema = mongoose.Schema;
const bookSchema = new Schema({
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
});

const Books = mongoose.model('Books', bookSchema);

const commentSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Books' },
  author: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

app.get('/', (req, res) => {
  res.send('Book store');
});
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book', details: err });
  }
});

app.get('/books/:bookId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ bookId: req.params.bookId }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err });
  }
});

app.post('/books/:bookId/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const comment = new Comment({
      bookId: req.params.bookId,
      author: author || 'Anonymous',
      text
    });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add comment', details: err });
  }
});

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}`);
});
