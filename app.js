// jshint esversion:6
import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";

const PORT = 4000; // Define your port number

// Define Mongoose schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Create an async function to connect to the database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Call the connectDB function
connectDB();

const Posts = mongoose.model('Post', postSchema);

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
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

// Other routes...

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`); // Use the PORT variable
});

// Export the app instance correctly
export default app; 
