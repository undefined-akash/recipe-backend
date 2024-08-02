const mongoose = require('mongoose');

const upVote = new mongoose.Schema({
  recipeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Recipe',
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
})

module.exports = mongoose.model('UpVote',upVote);