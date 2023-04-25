const userModel = require('../models/userModel');
const assignmentModel = require("../models/assignmentModel")
const { uploadFile } = require("./awsController")
const { validateString, validateRequest, validateEmail, regxName, fileValidator } = require("../validator/validations");

const uploadAssignment = async function (req, res){
    try {
        let body  = req.body;
        let assignmentDoc = req.files;
        let {assignmentBy, assignmentName, schoolName, studentEmail} = body;

        if (!assignmentDoc || assignmentDoc.length < 1) { return res.status(400).send({ status: false, message: "please provide Assignment Document" }) };
        if (!fileValidator(assignmentDoc[0].originalname)) { return res.status(400).send({ status: false, message: "only image, pdf, word file or ppt are allowed" }) };

        if (validateRequest(body)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) };

        if (!validateString(assignmentBy)) { return res.status(400).send({ status: false, message: "please provide the Teacher name" }) };
        if (!regxName(assignmentBy)) { return res.status(400).send({ status: false, message: "please provide a valid Teacher name" }) };

        if(!assignmentName){ return res.status(400).send({ status: false, message: "please provide Assignment name" }) };

        if(!schoolName && !studentEmail){ return res.status(400).send({ status: false, message: "please provide School Name or Student Email" }) };
        if (studentEmail && !validateEmail(studentEmail)) { return res.status(400).send({ status: false, message: "please provide a valid email" }) };

        let assign = await assignmentModel.findOne({assignmentName:assignmentName})
        if(!assign){
        let uploadedFileURL = await uploadFile(assignmentDoc[0]);
        assign = await assignmentModel.create({assignmentName:assignmentName, assignmentBy:assignmentBy, assignmentDoc:uploadedFileURL});
        }

        let obj = {};

        if(schoolName && studentEmail){
            obj.email = studentEmail,
            obj.schoolName = schoolName
        }else if(studentEmail){
            obj.email = studentEmail
        }else{
            obj.schoolName = schoolName
        }

        let newAssignment = {};
        newAssignment.assignmentId = assign._id

        let updateUsers = await userModel.updateMany(obj,{$push:{assignments:newAssignment}});
        if(updateUsers.matchesCount==0){ return res.status(400).send({ status: false, message: "No such student or group found" }) };

        res.status(200).send({ status: true, message: "Assignment successfully provided", data:updateUsers});

    }
    catch(err){
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = {uploadAssignment}