 
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';

const PORT = 4000;

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
 
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
 
connectDB();

const Posts = mongoose.model('Post', postSchema);

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", async (req, res) => {
  let allPosts = await Posts.find({});
  console.log(allPosts.length);
  if (allPosts.length > 4) {
    res.render("home", { posts1: allPosts });
  } else {
    res.render("home2", { posts1: allPosts });
  }
});

 
app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent });
});

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.get("/posts/:topic", async (req, res) => {
  let titleOfReadMorePost = req.params.topic;
  let foundPost = await Posts.findOne({ title: titleOfReadMorePost });
  res.render("post", { pTitle: foundPost.title, pBody: foundPost.content });
});

app.get("/post/:topic/edit", (req, res) => {
  let previousTitle = req.params.topic;
  res.render("edit", { p: previousTitle });
});

app.post("/post/:topic/edit", async (req, res) => {
  await Posts.updateOne(
    { title: req.params.topic },
    { $set: { title: req.body.postTitle, content: req.body.postBody } }
  );
  res.render("edited");
});

app.get("/post/:topic/delete", async (req, res) => {
  let toBeDeletedPost = req.params.topic;
  await Posts.deleteOne({ title: toBeDeletedPost });
  res.render("delete");
});

app.post("/newpost", async (req, res) => {
  let post = {
    title: req.body.postTitle,
    content: req.body.postBody, // Fix the key name from 'post' to 'content'
  };
  await Posts.create({ title: post.title, content: post.content });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

 
export default app; 
