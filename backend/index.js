const express = require("express");
const mongooes = require("mongoose");
const cors = require("cors");
const multer = require("multer");
let config = require("./config.json")

let app = express();
const errorHandler = require("./utils").errorHandler;

// Middleware
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + "/public")); // for testing 


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


app.listen(config.port, config.host, errorHandler);