const mongoose = require('mongoose');

// Create Schema 

const ctaegorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category must be required"],
        unique:[true,"Category must be unique"],
        minlength:[3,'To short category name'],
        maxlength:[40,'To long category name'],
    },
    slug:{
        type:String,
        lowercase:true
    },
       image:String,

},{
    timestamps:true
})

const setImageURL = (doc) => {
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  // findOne, findAll and update
  ctaegorySchema.post('init', (doc) => {
    setImageURL(doc);
  });
  
  // create
  ctaegorySchema.post('save', (doc) => {
    setImageURL(doc);
  });

// create model 

const categoryModel = mongoose.model('Category',ctaegorySchema)

module.exports = categoryModel;