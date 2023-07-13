const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    image:{
        type:String,
        default:'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcameroondeskacademy.com%2Fwp-content%2Fuploads%2F2018%2F12%2Fblogging-SMB.png&tbnid=62upMIZibh6rJM&vet=12ahUKEwjF6OrXiv3_AhW4micCHTpTBnEQMygXegUIARCUAg..i&imgrefurl=https%3A%2F%2Fcameroondeskacademy.com%2Fcourses%2Fformation-blogger%2F&docid=dCs0qYJVi-BINM&w=1721&h=941&q=blog&client=safari&ved=2ahUKEwjF6OrXiv3_AhW4micCHTpTBnEQMygXegUIARCUAg',
    },
    author:{
        type:String,
        default:'Admin',
    },
    images: [],
}, 
{
    toJSON: {
        virtuals:true,
    },
    toObject: {
        virtuals:true,
    },
    timestamps:true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);