const express = require('express');
require('./config');
const CONSTANTS = require('./constants');
const Student = require('./schemas/Students');
const REQRESPONSE = require('./responses/reqResponse');
const app = express();

app.use(express.json());

app.post('/student/create', async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send(new REQRESPONSE(400, {}, "Invalid request data"));
    }

    try {
        const data = new Student(req.body);
        const result = await data.save();
        const response = new REQRESPONSE(200, result, "Student added successfully");
        console.log(result);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(new REQRESPONSE(500, {}, "Internal Server Error"));
    }
});

// GET DATA
app.get('/student/getAll', async (req, res) => {
    try {
        const data = await Student.find();
        const response = new REQRESPONSE(200, data, "Students retrieved successfully");
        console.log(data);
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(new REQRESPONSE(500, {}, "Internal Server Error"));
    }
});

app.get('/student/getById/:_id', async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        return res.status(400).send(new REQRESPONSE(400, {}, "Invalid request data"));
    } 

    try {
        const data = await Student.findById(req.params._id);
        if (data) {
            const response = new REQRESPONSE(200, data, "Student Retrieved successfully");
            res.send(response);
        } else {
            return new REQRESPONSE(404, {}, "Student Not Found");
        }
    } catch (err) {
        res.status(500).send(new REQRESPONSE(500, {}, "Internal Server Error"));
    }
})

// UPDATE DATA
app.put('/student/update/:_id', async (req, res) => {
    const { _id } = req.params;

    if (!_id || !req.body) {
        return res.status(400).send(new REQRESPONSE(400, {}, "Invalid request data"));
    }

    try {
        const data = await Student.updateOne({ _id }, { $set: req.body });

        console.log(data);
        if (data.acknowledged === true && data.matchedCount === 1 && data.modifiedCount === 0) {
            return res.status(404).send(new REQRESPONSE(404, {}, "Student not found or no changes made"));
        }

        const response = new REQRESPONSE(200, data, "Student updated successfully");
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(new REQRESPONSE(500, {}, "Internal Server Error"));
    }
});

app.delete('/student/delete/:_id', async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        return res.status(400).send(new REQRESPONSE(400, {}, "Invalid request data"));
    }

    try {
        const data = await Student.deleteOne(req.params);
        if (data.deletedCount > 0) {
            res.send(new REQRESPONSE(200, {deleteCount: data.deletedCount}, "Student deleted successfully"));
        } else {
            res.send(new REQRESPONSE(404, {deleteCount: data.deletedCount}, "Student not found"));
        }
    } catch (e) {
        res.status(500).send(new REQRESPONSE(500, {}, "Internal Server Error"));
    }

    
})

app.listen(CONSTANTS.PORT, ()=> {
    console.log("Server is listening on port " + CONSTANTS.PORT);
})