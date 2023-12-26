const express = require ("express");
const app= express();
app.set('view engine', 'ejs');
const con = require("./db/connection");
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
const session = require('express-session')
const multer = require('multer')
app.use(express.static('upload'))
const path = require("path")



app.get("/", (req, res) => {
    var descriptionQuery = `SELECT * FROM description`;
    var signupQuery = `SELECT * FROM signup`;

    con.query(descriptionQuery, function (descErr, descResult) {
        if (descErr) {
            console.log(descErr);
        } else {
            con.query(signupQuery, function (signupErr, signupResult) {
                if (signupErr) {
                    console.log(signupErr);
                } else {
                    res.render("index", { result: descResult, result1: signupResult });
                }
            });
        }
    });
});

app.get("/navbar",(req,res)=>{
    res.render("navbar")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/job_desc_form",(req,res)=>{
    res.render("job_desc_form")
})

// SESSION  ======================================
app.use(session({
  secret: "SESS_SECRET:'{}'!@#$$#!SESS_SECRET",
  saveUninitialized: true,
  cookie: {maxAge: 3000 },
  resave: false
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.post('/signup', upload.single('images'), (req, res) => {
    const { name, email, password, userType, c_name } = req.body;
    
    if (!req.file) {
        res.status(400).send('Please upload an image');
        return;
    }

    const image = req.file.filename;

    const query = 'INSERT INTO signup (name, email, password, userType, c_name, image) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [name, email, password, userType, c_name, image], (err, result) => {
        if (err) {
            res.status(500).send('Error saving data to database');
            return;
        }
        res.render('login');
    });
});


  app.post("/job_desc_form",(req,res)=>{
    const{post_name,job_field,experience,job_desc,job_location,contact_no,qualification,post_date} = req.body;

    const query = 'INSERT INTO description (post_name,job_field,experience,job_desc,job_location,contact_no,qualification,post_date) VALUES (?,?,?,?,?,?,?,?)';
    con.query(query, [post_name,job_field,experience,job_desc,job_location,contact_no,qualification,post_date], (err, result) => {
        if (err) {
          // console.error('Error saving image to database:', err);
          res.status(500).send('Error saving data to database');
          return;
        }
        res.render('job_desc_form');
      });  })


     
  app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    con.query(`SELECT * FROM signup WHERE email = '${email}'`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
           res.render('index')
        }
    });
});


app.listen(5050,()=>{
    console.log("Aage Badho")
})