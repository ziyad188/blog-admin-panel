var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
  
var fs = require('fs');
var path = require('path');
const url ="mongodb+srv://ziyad188:axbycz02@cluster0.x2l6kah.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var postModel = require('./model');
  
// Set EJS as templating engine 
app.set("view engine", "ejs");
app.use(express.static('public'));
var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

app.get("/", (req, res) => {
    postModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render("blog-post-list",{items:items});
        }
    });
    
});
app.post("/blog", function(req,res){
    var u = req.body.id;
    res.redirect("/"+u);
    
})
app.get("/:postId", function(req,res){
    var reqPostId = req.params.postId;
    postModel.findOne({_id:reqPostId}, function(err,post){
        if(!err){
            res.render("blog-post",{title:post.title,date: post.date,name:post.name,content:post.content,img: post.img})
        }
    })
})
app.get("/admin", function(req,res){
    res.render("login",{msg: ""});
    
});
app.get("/contact", function(req,res){
    res.render("contact");
})
app.post("/admin", function(req,res){
    const username= "admin";
    const password = "admin";
    const err = "password or username is incorrect please try again!";
    if(username === req.body.username){
        if(password === req.body.password){
            res.render("admin-panel");
        }else{
            res.render("login",{msg:err});
        }
    }else{
        res.render("login",{msg:err});
    }
})

app.post('/', upload.single('image'), (req, res, next) => {
    var obj = {
        title: req.body.title,
        date: req.body.date,
        name: req.body.name,
        tagline: req.body.tagline,
        content: req.body.content,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    postModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

app.listen(process.env.PORT||"3000", function(){
    console.log("server is listening at port 3000");
})