const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const {connect} = require('./config/database')
const router = require('./routes/route')
const cloudinary = require('./config/cloudinary');
const fileUpload = require('express-fileupload');


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

const PORT = process.env.PORT || 8800

app.listen(PORT,() => {
  console.log(`Server started on ${PORT}`);
  connect();
  cloudinary.cloudinaryConnect();
})


app.get('/',(req,res)  => {
  res.status(200).json({
    message:'Welcome to Recipe-Keeper Backend'
  })
})
app.get('/api/v1',(req,res) => {
  res.status(200).json({
    success: true,
    message:'Message from API/V1'
  })
})

app.use('/api/v1',router)