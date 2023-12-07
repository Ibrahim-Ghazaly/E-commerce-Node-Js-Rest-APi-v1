const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true, 
        required:[true,'name is required'],
    },
    slug:{
        type:String, 
        lowercase:true
    },
    email:{
        type:String, 
        required:[true,'email is required'],
        unique:true,
        lowercase:true
    },
    phone:String,
    profileImg:String,
    password:{
        type:String,
        required:[true,'password is required'],
        minlength:[6,'Too short password']
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role:{
        type:String, 
        enum:['admin','manager','user'],
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },

    // child refrence   one to many
    wishlist:[{
      type:mongoose.Schema.ObjectId,
      ref:'Product',

    }],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
},{timestamps:true})






// hash password befor saving in db 


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });








const setImageURL = (doc) => {
    if (doc.profileImg) {
      const profileImgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
      doc.profileImg = profileImgUrl;
    }
  };
  // findOne, findAll and update
  userSchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  userSchema.post('save', (doc) => {
    setImageURL(doc);
  });

module.exports = mongoose.model('User',userSchema);