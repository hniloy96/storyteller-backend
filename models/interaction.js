const mongoose = require('mongoose')

//a schema for creating interaction data
const interactionSchema = new mongoose.Schema({
  comments: {
    type: Array,
    default: [],
  },
  likes: {
    type: Array,
    default: []
  },
  post:{
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
},
  {
    timestamps: true
})

const Interaction = mongoose.model('interaction', interactionSchema)
module.exports = Interaction;
