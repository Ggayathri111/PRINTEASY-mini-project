// Make sure this is at the top
const jwt = require("jsonwebtoken");
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const upload=multer();
const stream=require("stream")
const fs=require('fs')
const path=require("path")
const uploadFolder = './public/uploads';
const {google}=require('googleapis')
// Ensure the folder exists, or create it if it doesn't
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const bcrypt = require("bcrypt");
DANGEROUSLY_DISABLE_HOST_CHECK=true;
const mongoose=require('mongoose');
const { type } = require("os");
JWT_SECRET="34567897654324567897654321"
const app = express();

app.use(express.json());
app.use(cors({
 origin:"  https://a856-2401-4900-62d6-3f51-c901-97f7-9746-c5ed.ngrok-free.app",
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
const finaldb = mongoose.createConnection('mongodb://localhost:27017/helluser');
const loggeddb = mongoose.createConnection('mongodb://localhost:27017/helclient');
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
});
loginSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = bcrypt.compare(password, user.password);
  return isMatch;
  };
  const logme = loggeddb.model('logme', loginSchema);
const  userschema=new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     required: true, 
     ref: 'logme'
     },
  filename:{
      type:String,
      required:true,
  },
  url:{
      type:String,
      required:true,
  },
  tag:{
      type:Number,
      required:true,
  },
  flag:{
    type:Boolean,
    require:true
  }

});
const User=finaldb.model('User',userschema)

//jwt authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token,JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request object
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

const KEYFILEPATH = path.join(__dirname, "key.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

//cutomer api call
app.post("/upload",authenticate, upload.any(), async (req, res) => {
  try {
    const { files } = req;

    if (!files || files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const fileUrls = [];
    for (let file of files) {
      const fileId = await uploadFileToDrive(file);
      const publicUrl = await makeFilePublic(fileId);
      fileUrls.push({ name: file.originalname, url: publicUrl });
    }

    res.status(200).send({
      message: "Files uploaded successfully!",
      files: fileUrls,
    });
  } catch (error) {
    console.error("Error uploading files:", error.response ? error.response.data : error.message);
    res.status(500).send("An error occurred during file upload.");
  }
});

// Helper function to upload a file to Google Drive
const uploadFileToDrive = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const { data } = await drive.files.create({
    media: {
      mimeType: fileObject.mimetype,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ["19JOvEild4Omc9bhTZnFScQe0ZzmKBBrd"], // Replace with your folder ID
    },
    fields: "id",
  });

  console.log(`Uploaded file: ${fileObject.originalname} (ID: ${data.id})`);
  return data.id; // Return the file ID for further operations
};

// Helper function to make a file publicly accessible
const makeFilePublic = async (fileId) => {
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone", // Anyone can access
    },
  });

  // Generate a publicly accessible URL
  const { data } = await drive.files.get({
    fileId,
    fields: "webViewLink, webContentLink",
  });

  console.log(`Public URL for file: ${data.webViewLink}`);
  return data.webViewLink; // Return the public view link
};

//mongo db for creating user model
app.post('/file',authenticate, async (req, res) => {
  
  try{
   const{filename,url,tag,flag}= req.body;
   
   const userId=req.userId;
   const newfile=await User.create({
     userId:req.userId,
     filename:filename,
     url:url,
     tag:tag,
     flag:flag
    });
    await newfile.save();
    
   res.send("success")
 }
 catch(error){
   res.send(error);
 }
  });
  //from mongo db we get files to show on screen 
  app.get('/myfiles', authenticate, async (req, res) => {
    try {
      const userFiles = await User.find({ userId: req.userId });
      res.json(userFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).send("Error fetching files");
    }
  });
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await logme.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const user = new logme({ username, password: hashedPassword });
    await user.save();
    res.send("User registered successfully");
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await logme.findOne({ username }); 
  if (!user){
      return res.status(400).send("User not found");
            }
  const validPassword =await bcrypt.compare(password, user.password);
  
  if (!validPassword){
      return res.status(400).send("Invalid credentials");
  }
  
  const token = jwt.sign({userId: user._id},JWT_SECRET, { expiresIn: '1h' });
  console.log(token);
  user.tokens.push({ token });
  await user.save();
  res.send({ token });
});


app.delete('/deletefile', async (req, res) => {
  const { url } = req.body;
   const result=await User.deleteOne({url});
   console.log(result);
   res.send("deleted");
});


app.patch('/update', authenticate, async (req, res) => { 
  const { tag } = req.body;
  const userId = req.userId;
  console.log('Received tag:', tag);
  console.log('User ID from token:', userId);

  try {
    const response = await User.updateMany(
      { userId: userId },
      { $set: { tag:tag } }
    );
    console.log('tag', tag);
    res.json({ message: 'Tag updated successfully.' });
  } catch (error) {
    console.error('Error in update:', error);
    res.status(500).json({ error: 'Error updating tag.' });
  }
});
app.patch('/vendor',async (req,res)=>{
  const {tag,isChecked}=req.body;
  console.log(isChecked)
  await User.updateMany(
    {tag:tag},
    {$set:{tag:0} }
  );
 res.send("tag set to 0 ");
})
app.patch('/toggle', async(req,res)=>{
  const {isChecked,objectId}=req.body;
  
 const response= await User.updateOne({  _id:objectId }, { $set: { flag: isChecked } });

  res.send(response)
})

app.get('/scan',async (req,res)=>{
  const code=req.query.code;
  
   const result=await User.find({tag:code,flag:true})
  if(result.length>0){
  res.json(result);
  }
  else {
    res.send("not found");

  }
})

app.delete('/delete',async (req,res)=>{
  const {tag}=req.query;
  try{
    const result=await User.deleteOne({tag:tag});
  }
  catch{
    console.log("errrr");
  }
  res.send("deleted successfully");
})




app.listen(8000, () => {
  console.log("Server is running on http://0.0.0.0:8000");
});