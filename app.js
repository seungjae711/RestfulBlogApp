var express     = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app         = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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

// EDIT 
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// SHOW
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        }else {
            res.render("show", {blog: foundBlog});
        }
    });
});


// UPDATE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
}); 

// DELETE
app.delete("/blogs/:id", function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
        }
    })
});

app.listen(3000, function() {
    console.log("SERVER IS RUNNING")
})