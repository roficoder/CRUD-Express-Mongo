const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({
    name: String,
    fatherName: String,
    age: Number,
    contactNumber: String
})

module.exports = mongoose.model('student', StudentSchema);