const User = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async(req,res ) => {
  try {
    const {name,userName,email,password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
      console.log('User already exists')
      res.status(401).json({
        success: false,
        message:'User already exists'
      })
      return;
    }
    const userNameRegisterd = await User.findOne({userName});
    if(userNameRegisterd){
      console.log('Choose a unique username')
      res.status(401).json({
        success: false,
        message:'Please enter a unique username'
      })
      return;
    }
    const hashedPassword = await bcrypt.hash(password,10)
    console.log('User signed up successfully')
    const user = await User.create({name,userName,email,password:hashedPassword});
    let payload = {
      id:user._id,
      name:user.name,
      email:user.email,
      userName:user.userName,
      bio:user.bio,
      recipes:user.recipes,
      upVotes:user.upVotes,
      rating:user.rating
    }
    let token = jwt.sign(payload,"saurav",{expiresIn:'1d'});
    res.status(200).json({
      success: true,
      token:token,
      message:"User signed up successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message:'Error while signing up'
    })
  }
}

exports.login = async(req,res) => {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      console.log('User not found')
      res.status(404).json({
        success: false,
        message: 'User not found in the database'
      });
      return;
    }
    const isMatch = await bcrypt.compare(password,user.password );
    if(isMatch){
      const payload = {
        id:user._id,
        name:user.name,
        email:user.email,
        userName:user.userName,
        bio:user.bio,
        recipes:user.recipes,
        upVotes:user.upVotes,
        rating:user.rating,
        imageUrl:user.imageUrl
      }
      let token = jwt.sign(payload,"saurav",{expiresIn:'1d'})
      console.log('User logged in successfully')
      res.status(200).json({
        success:true,
        token:token,
        message: 'User logged in successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Password does not match'
      });
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message:'Error while logging in'
    })
  }
}

exports.updateProfile = async(req,res) => {
  try {
    const {id} = req.params
    const {name,userName,bio} = req.body
    const user = await User.findById(id);
    if(!user) {
      throw new Error('User not found')
    }
    user.name = name;
    user.userName = userName;
    user.bio = bio;
    await user.save();
    res.status(200).json({
      success: true,  
      message: 'User prfile updated successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Unable to update user prfile '
    })
  }
}

exports.getUserByUserName = async(req,res) => {
  try {
    const {userName} = req.params;
    if(!userName) {
      throw new Error('Unable to get userName')
    }
    const user = await User.findOne({userName});
    if(!user) {
      throw new Error('User not found')
    }
    res.status(200).json({
      success: true,
      user: user,
      message:'User data fetced successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getUserById = async(req,res) => {
  try {
    const id = req.params.id
    const data = await User.findById(id)
    const user = {
      username:data.userName,
      name: data.name,
      email: data.email,
      image: data.imageUrl
    }
    if(!user) {
      throw new Error('User not found')
    }
    res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      user: user
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({}, { userName: 1 });
    const usernames = allUsers.map(user => user.userName);
    res.status(200).json({
      success: true,
      message: 'All usernames fetched successfully',
      usernames: usernames
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
