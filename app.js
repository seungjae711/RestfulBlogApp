var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app         = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGGOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"The cutest dog",
//     image:"https://i.ytimg.com/vi/IOoqtlA8i2Y/maxresdefault.jpg",
//     body: "",
//     // created
// });


// RESTFULL ROUTES
// HOME
app.get("/", function(req, res) {
    res.redirect("/blogs");
})

// INDEX
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else {
            res.render("index", {blogs: blogs});
        }
    })
})

// NEW 
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// CREATE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else {
            res.redirect("/blogs");
        }
    })
})

// SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        }else {
            res.render("show", {blog: foundBlog});
        }
    })
})

app.listen(3000, function() {
    console.log("SERVER IS RUNNING")
})