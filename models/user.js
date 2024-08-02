const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String,
  },
  bio: {
    type: String,
    default: "",
  },
  recipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  }],
  upVotes: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

// userSchema.post("save", async function (doc) {
//   try {
//     console.log("Doc : ", doc);
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     let info = await transporter.sendMail({
//       from: "Recipe Keeper",
//       to: doc.email,
//       subject: "Welcome to Recipe Keeper",
//       html: `<h1>Hello ${doc.name}</h1><h2>Recipe Keeper</h2> <p>Says hi</p> <a href='https://recipekkeeper.netlify.app/'>Recipe Keeper</a>`,
//     });
//     console.log(info);
//   } catch (error) {
//     console.log(error);
//   }
// });


//function to calculate upvotes
userSchema.virtual('totalUpVotes').get(function() {
  if (this.recipes && this.recipes.length > 0) {
    return this.recipes.reduce((totalUpVotes, recipe) => totalUpVotes + recipe.upVotes, 0);
  }
  return 0;
});

//function to updateUpVotes
userSchema.methods.updateUpVotes = async function() {
  const User = this.model('User');
  const user = await User.findById(this._id).populate('recipes');

  if (!user) {
    throw new Error('User not found');
  }

  const totalUpVotes = user.recipes.reduce((total, recipe) => total + recipe.upVotes, 0);
  user.upVotes = totalUpVotes;
  await user.save();
};

//function to call updateUpVotes function
userSchema.post('save', async function(doc) {
  try {
    await doc.updateUpVotes();
  } catch (error) {
    console.error('Error updating upVotes:', error);
  }
});

module.exports = mongoose.model("User", userSchema);
