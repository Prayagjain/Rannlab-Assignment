# Assignment-Management

## Teacher can Provide to perticular Student or Group of student

## Overview
This project is used to Assign Assignment to the Students. So we are building some restful Api's where we can create user , login user and upload Assignment. So to differentiate that a particular assignment belongs to a student or group of students we are using student Email and School Name, if Email is provide means it belongs to a particular Student and if School Name is provided means it belong to the group of student which are from that School. 

### Key points
- Create a database `Assignment`. You can clean the db you previously used and reuse that.
- Create two collection, one is for user and one is for Assignments

### Models
- user Model
```
{ firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: { 
        type: String,
        require: true 
    },
    assignments:[{
        assignmentId:{type:ObjectId, ref:"Assignment"},
        _id:0
    }] }
```
- Assignment Model
```
{
    assignmentName: { type: String, require: true, unique: true },
    assignmentBy: {type:String,require:true},
    assignmentDoc:{type:String, require:true}
  }

```

### POST /registeruser
- Create user with the help of data recieved in the request body.
- Take firstName, lastName, schoolName, email, password, mobile and Profile image from body
- Bycrip the password for Security
- Validate the credential correctly and check duplicacy of email and mobile.
- Return Http status 201 for successful creation
- Return HTTP status 400 for an invalid request

### Post /login
- Login user by receving data from body
- Recieve mobile and password 
- Validate the credential and check Credential by DB call
- Return Jwt token for successful login with satus code 201 
- expire token 1 minute

### post /uploadassignment
- Receive Data from body section
- Recieve assignmentBy, assignmentName, schoolName, studentEmail and AssignmentDoc from body
- Validate all the property and atleast one field is provided from Student email and School Name. 

## Testing 
- To test these apis create a new collection in Postman named them Rannlab Assignment
- Each api should have a new request in this collection
- Each request in the collection should be rightly named.

### How to run the project
- first enter in a git repsitory by cd command
- Enter to src folder
- Now to start project on port 4000 we can use Command "npx nodemon index.js"