const express = require("express")
const router = express.Router()
const { createUser, userLogin } = require("../controllers/userController")
const { uploadAssignment } = require("../controllers/assignmentController")

router.post("/registeruser", createUser)
router.post("/login", userLogin)
router.post("/uploadassignment",uploadAssignment)

module.exports = router;