const express = require("express");
const mongooes = require("mongoose");
const cors = require("cors");
const multer = require("multer");
let config = require("./config.json");
const bcrypt = require("bcryptjs")
const { verifyToken, generateToken } = require("./middlewares/auth.middlewares");
const { authorizeRole } = require("./middlewares/role.middlewares");

let app = express();
const errorHandler = require("./utils").errorHandler;

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + "/public"));


let url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=valtech`;

mongooes.connect(url)
    .then(res => console.log("Database Connected !!"))
    .catch(err => console.log("Error when connecting database :", err));

let objectId = mongooes.Schema.ObjectId;
let schema = mongooes.Schema;

let Users = mongooes.model(
    "Users", new schema({
        id: objectId,
        role: { type: String, enum: ["Admin", "User"] },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        mobile: { type: Number, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        Books: [{ type: mongooes.Schema.Types.ObjectId, ref: "Books" }]

    }).pre('save', async function (next) {
        if (!this.isModified('password')) return next();

        try {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
            next();
        } catch (err) {
            next(err);
        }
    })
);

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

const commentSchema = new schema({
    bookId: { type: schema.Types.ObjectId, required: true, ref: 'Books' },
    author: { type: String, default: 'Anonymous' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Comment = mongooes.model('Comment', commentSchema);

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


app.post("/addBook", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), verifyToken, authorizeRole("Admin"), (req, res) => {
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

app.get("/admin/books", verifyToken, (req, res) => {
    Books.find({}, {
        title: 1,
        price: 1,
        coverImage: 1,
        coverImageType: 1,
        keywords: 1,
        author: 1,
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

app.delete("/books/:id", verifyToken, authorizeRole("Admin"), (req, res) => {
    Books.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Book deleted" }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/users/", verifyToken, authorizeRole("Admin"), (req, res) => {
    Users.find().then((data) => res.status(200).json({ users: data })).catch(e => console.log(e));
})
app.post("/users/",async (req,res)=>{
    
    if(!req.body){
        return res.status(400).json({message:"Please Enter User Details"});
    }
    req.body.role="User"
    try{
        const user=await Users.findOne({$or: [
    { email: req.body.email },
    { mobile: req.body.mobile }
  ]})

        if(user){
            return res.status(400).json({message:"User Already Exists"})
        }
        try{
            const newUser=await Users.create(req.body);
            return res.status(200).json({message:newUser});
        }
        catch(error){
            return res.status(500).json({message:"Error While Creating User"})
        }
        
    }
    catch(error){
            return res.status(500).json({message:"Internal Server Error"})
    }

})

app.post("/users/login",async (req,res)=>{
    if(!req.body){
        return res.status(400).json({message:"Please Enter Proper Credentials"})
    }
    try{
    const userData=await Users.findOne({email:req.body.email});
    if(userData){
        if(await bcrypt.compare(req.body.password,userData.password)){
            const token=generateToken({username:req.body.email,role:userData.role});
           return res.status(200).json({token:token});
        }
        else {
            return res.status(401).json({ message: "InValid Credentials " })
        }
    }
    else{
       return res.status(404).json({message:"No Such User Found"})
    }
}
catch(error){
    return res.status(500).json({message:"Internal Server Error"})
}




})


//comment
app.get('/books/:bookId/comments', verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ bookId: req.params.bookId }).sort({ date: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments', details: err });
    }
});

app.delete('/comments/:id', verifyToken, (req, res) => {
    Comment.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Comment deleted" }))
        .catch(err => res.status(500).json({ error: err.message }));
});


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
