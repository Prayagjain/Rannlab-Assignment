let mongoose = require("mongoose")

let assignmentSchema = new mongoose.Schema(
  {
    assignmentName: { type: String, require: true, unique: true },
    assignmentBy: {type:String,require:true},
    assignmentDoc:{type:String, require:true}
  },
  { timestamps: true })

module.exports = mongoose.model('Assignment', assignmentSchema)