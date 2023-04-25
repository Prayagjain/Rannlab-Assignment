const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("./awsController")
const { validateString, validateRequest, validateEmail, regexPhoneNumber, regxName, validatePassword, imageExtValidator } = require("../validator/validations");

let createUser = async function (req, res) {
    try {
        let data = req.body;
        let profileImage = req.files;
        let { firstName, lastName, schoolName, email, password, mobile } = data;

        if (!profileImage || profileImage.length < 1) { return res.status(400).send({ status: false, message: "please provide profile Image" }) };
        if (!imageExtValidator(profileImage[0].originalname)) { return res.status(400).send({ status: false, message: "only image file is allowed" }) };

        if (validateRequest(data)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) };

        if (!validateString(firstName)) { return res.status(400).send({ status: false, message: "please provide the first name" }) };
        if (!regxName(firstName)) { return res.status(400).send({ status: false, message: "please provide a valid first name" }) };

        if (!validateString(lastName)) { return res.status(400).send({ status: false, message: "please provide the last name" }) };
        if (!regxName(lastName)) { return res.status(400).send({ status: false, message: "please provide a valid last name" }) };

        if (!validateString(schoolName)) { return res.status(400).send({ status: false, message: "please provide the school name" }) };

        if (!validateString(email)) { return res.status(400).send({ status: false, message: "please provide the email" }) };
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "please provide a valid email" }) };

        if (!validateString(mobile)) { return res.status(400).send({ status: false, message: "please provide the phone number" }) };
        if (!regexPhoneNumber(mobile)) { return res.status(400).send({ status: false, message: "please provide a valid phone number" }) };

        if (!validateString(password)) { return res.status(400).send({ status: false, message: "please provide the password" }) };
        if (!validatePassword(password)) { return res.status(400).send({ status: false, message: "Please provide a valid password with atleast one uppercase one lowercase  one special character and must contain atleast 6 characters" }) };

        let isDuplicateEmail = await userModel.findOne({ email: email });
        if (isDuplicateEmail) { return res.status(400).send({ status: false, message: "This email is already exists" }) };

        let isDuplicatePhone = await userModel.findOne({ mobile: mobile });
        if (isDuplicatePhone) { return res.status(400).send({ status: false, message: "This phone number is already exists" }) };

        let uploadedFileURL = await uploadFile(profileImage[0]);
        data.profileImage = uploadedFileURL

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        data.password = encryptedPassword;

        let createdData = await userModel.create(data);
        res.status(201).send({ status: true, message: "user registered successfully", data: createdData });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};

let userLogin = async function (req, res) {
    try {
        let mobile = req.body.mobile;
        let password = req.body.password;
        if (!validateString(mobile)) { return res.status(400).send({ status: false, message: "please provide the phone number" }) };
        if (!regexPhoneNumber(mobile)) { return res.status(400).send({ status: false, message: "please provide a valid phone number" }) };

        if (!validateString(password)) { return res.status(400).send({ status: false, message: "password is required" }) };

        let user = await userModel.findOne({ mobile: mobile });
        if (!user) return res.status(401).send({ status: false, message: "mobile is not correct", });

        const passwordDetails = await bcrypt.compare(password, user.password);
        if (!passwordDetails) return res.status(401).send({ status: false, message: "password is incorrect, please provide correct password" });

        let token = jwt.sign(
            {
                _id: user._id.toString(),
                iat: new Date().getTime(),
            },
            "Rannlab-Assignment",
            {expiresIn:"60s"}
        );

        res.status(200).send({ userId: user._id, userName: user.fname, token: token });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = { createUser, userLogin };