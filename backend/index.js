const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { GridFSBucket, ObjectID } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;
const dotenv = require("dotenv"); //  Loads environment variables from .env file
dotenv.config({ path: ".env" });

app.use(bodyParser.json())

// Allow requests from specific origins
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'https://onlinecourses-0o2r.onrender.com' }));

// console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, { dbName: process.env.DB_NAME })


// Define all schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  favouriteCourses: [{
    courseId: String,
    courseName: String
  }]
})

const contentSchema = new mongoose.Schema({
  name: String,
  category: String,
  duration: String,
  description: String,
  owner: String,
  image: { data: Buffer, contentType: String, name: String },
  videos: [
    {
      data: Buffer,
      contentType: String,
      name: String
    },
  ],
});

const Users = mongoose.model('users', userSchema);
const Course = mongoose.model('Course', contentSchema);
const CourseSD = mongoose.model('CourseSD', contentSchema);

//routes
app.post('/api/register', async (req, res) => {
  try {
    console.log(req.body);
    const user = new Users({ name: req.body.name, email: req.body.email, password: req.body.password, favouriteCourses: [] });
    await user.save();
    res.status(201).json({ user: user });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error });
  }
});

app.post('/updateProfile/:id', async(req,res) => {
  try{
    const filter = { _id: req.params.id };
    const update = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
    }
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  }catch{
    console.log(error)
    res.status(400).json({ error: error });
  }
})

app.post('/updateUserFav/add/:id', async(req,res) => {
  try{
    console.log(req.body)
    console.log(req.body.newFavouriteCourse)
    const filter = { _id: req.params.id };
    const update = {
      $push: {
        favouriteCourses: req.body.newFavouriteCourse
      }
    }
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  }catch(error){
    console.log(error)
    res.status(400).json({ error: error });
  }
})

app.post('/updateUserFav/remove/:id', async(req,res) => {
  try{
    console.log(req.body)
    console.log(req.body.newFavouriteCourse)
    const filter = { _id: req.params.id };
    const update = {
      $pull: {
        favouriteCourses: req.body.newFavouriteCourse
      }
    }
    await Users.updateOne(filter, update);
    const user = await Users.findOne(filter);
    res.status(201).json({ user: user });
  }catch(error){
    console.log(error)
    res.status(400).json({ error: error });
  }
})

app.get('/favouriteCourses/:id', async(req,res) => {
  try{
    const user = await Users.findOne({ _id: req.params.id});

    if (user) {
      const favoriteCourseIds = user.favouriteCourses.map((favCourse) => favCourse.courseId); // Assuming the field is named 'favoriteCourses'
  
      // Find the favorite courses based on the IDs in the array
      const favoriteCourses = await Course.find({
        _id: { $in: favoriteCourseIds },
      });

      res.status(201).json({ favouriteCourses: favoriteCourses });
  
      // console.log('Favorite courses:', favoriteCourses);
    } else {
      console.log('User not found.');
    }
  }catch(error){
    console.log(error)
  }
})


app.post('/api/login', async (req, res) => {
  try {
    // console.log(req.body);
    const user = await Users.findOne({ email: req.body.email })
    if (user != null) {
      if (user.password == req.body.password) {
        res.status(201).json({ user: user });
      } else {
        res.status(201).json({ error: "Wrong Password" });
      }
    } else {
      res.status(201).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error });
  }
});





// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, file.originalname)
  }
})

const memoryUpload = multer({
  storage: multer.memoryStorage(),
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    callback(null, true)
  },
  limits: {

  }
})

// Set up a route for file uploads
app.post('/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 30 }]), async (req, res) => {
  try {
    // Create a new content document and store the uploaded file
    const newContent = new Course({
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      description: req.body.description,
      owner: req.body.owner,
      image: {
        data: req.files['image'][0].buffer,
        name: req.body.name,
        contentType: req.files['image'][0].mimetype,
      },
    });

    const newContentSD = new CourseSD({
      name: req.body.name,
      category: req.body.category,
      duration: req.body.duration,
      description: req.body.description,
      owner: req.body.owner,
      image: {
        data: req.files['image'][0].buffer,
        name: req.files['image'][0].originalname,
        contentType: req.files['image'][0].mimetype,
      },
    });

    // Read the file contents
    const filePath = 'uploads/' + req.files['image'][0].originalname;
    const fileContents = fs.readFileSync(filePath);

    newContent.image = {
      data: fileContents,
      contentType: req.files['image'][0].mimetype,
    };

    newContentSD.image = {
      data: fileContents,
      contentType: req.files['image'][0].mimetype,
    };


    // Store video files in the 'videos' field
    if (req.files) {
      newContent.videos = req.files['video'].map((videoFile) => ({
        data: fs.readFileSync('uploads/' + videoFile.originalname),
        contentType: videoFile.mimetype,
        name: videoFile.originalname
      }));
    }

    const course = await newContent.save();
    newContentSD._id = course._id
    await newContentSD.save();
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

// Set up a route for cousre updates
app.post('/updateCourse/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 30 }]), async (req, res) => {
  try {

    // Read the file contents
    const filePath = 'uploads/' + req.files['image'][0].originalname;
    const fileContents = fs.readFileSync(filePath);

    var image = {
      data: fileContents,
      contentType: req.files['image'][0].mimetype,
    };

    // Store video files in the 'videos' field
    if (req.files) {
      var videos = req.files['video'].map((videoFile) => ({
        data: fs.readFileSync('uploads/' + videoFile.originalname),
        contentType: videoFile.mimetype,
        name: videoFile.originalname
      }));
    }

    const filter = { _id: req.params.id };
    const update = {
      $set: {
        name: req.body.name,
        category: req.body.category,
        duration: req.body.duration,
        description: req.body.description,
        owner: req.body.owner,
        image: image,
        videos: videos
      }
    };
    await Course.updateOne(filter, update);

    const updateSD = {
      $set: {
        name: req.body.name,
        category: req.body.category,
        duration: req.body.duration,
        description: req.body.description,
        owner: req.body.owner,
        image: image
      }
    };
    await CourseSD.updateOne(filter, updateSD);

    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});


// Create an API endpoint to fetch the list of courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await CourseSD.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Create an API endpoint to fetch the list of courses of particular user
app.get('/courses/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const course = await CourseSD.find({ owner: userId });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Create an API endpoint to fetch the list of courses
app.get('/courseContent/:id', async (req, res) => {
  try {
    // Convert the targetId to an ObjectID
    const courseId = req.params.id;
    const course = await Course.findOne({ _id: courseId });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
