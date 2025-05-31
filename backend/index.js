const express = require("express");
const mongooes = require("mongoose");
const cors = require("cors");
const multer = require("multer");
let config = require("./config.json")

let app = express();
const errorHandler = require("./utils").errorHandler;

app.use(express.json());
app.use(cors());

let url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=valtech`;

mongooes.connect(url)
    .then(res => console.log("Database Connected !!"))
    .catch(err => console.log("Error when connecting database :", err));

let objectId = mongooes.Schema.ObjectId;
let schema = mongooes.Schema;

//Schema Add below
//for user detail -- schema name --> users


let Books = mongooes.model(
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

let upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get("/", (req, res) => {
    res.render("index.html");
});

app.get("/user/books", (req, res) => {
    Books.find({},{
        title:1,
        price:1,
        coverImage:1,
        coverImageType:1,
        keywords:1,
        author:1,
    })
    .then((dbres) => {
            res.json(dbres.map((book) => {
                let bookData = book.toObject();
                bookData.coverImage = (bookData.coverImage && bookData.coverImageType)
                    ? `data:${bookData.coverImageType};base64,${bookData.coverImage.toString("base64")}`
                    : null;
                return bookData;
            }));
        })
        .catch((err) => errorHandler(err));
});

// add book
app.post("/addBook", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), (req, res) => {
    let book = new Books(req.body);

    let coverImage = req.files["coverImage"][0];
    book.coverImage = coverImage.buffer;
    book.coverImageType = coverImage.mimetype;

    let pdf = req.files["pdf"][0];
    book.pdf = pdf.buffer;
    book.pdfType = pdf.mimetype;

    book.save()
        .then((dbres) =>
            res.status(200).send({ message: "Book Added", book: dbres }))
        .catch((err) => errorHandler(err));
});

app.get("/books", (req, res) => {
    Books.find()
        .then((dbres) => {
            res.json(dbres.map((book) => {
                let bookData = book.toObject();
                bookData.coverImage = (bookData.coverImage && bookData.coverImageType)
                    ? `data:${bookData.coverImageType};base64,${bookData.coverImage.toString("base64")}`
                    : null;
                bookData.pdf = (bookData.pdf && bookData.pdfType)
                    ? `data:${bookData.pdfType};base64,${bookData.pdf.toString("base64")}`
                    : null;
                return bookData;
            }));
        })
        .catch((err) => errorHandler(err));
});

app.delete("/books/:id", (req, res) => {
    Books.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Book deleted" }))
        .catch(err => res.status(500).json({ error: err.message }));
});

const commentSchema = new schema({
  bookId: { type: schema.Types.ObjectId, required: true, ref: 'Books' },
  author: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Comment = mongooes.model('Comment', commentSchema);

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
