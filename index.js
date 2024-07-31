const express = require('express');
require('./config');
const Student = require('./schemas/Students');
const {REQRESPONSE, LISTRESPONSE} = require('./responses/reqResponse');
const app = express();
require('dotenv').config();


app.use(express.json());

// SEARCH DATA WITH QUERY
// SEARCH DATA using query parameters
app.get('/student/search/query', async (req, res) => {
    try {
        const { name, fatherName } = req.query;  // Access the query parameters

        // Build the search criteria based on provided query parameters
        const searchCriteria = {};

        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' };  // Case-insensitive search
        }

        if (fatherName) {
            searchCriteria.fatherName = { $regex: fatherName, $options: 'i' };  // Case-insensitive search
        }

        // If no query parameters are provided, return an error
        if (!name && !fatherName) {
            return res.status(400).send({ error: "At least one query parameter ('name' or 'fatherName') is required" });
        }

        const data = await Student.find({
            "$or": [
                searchCriteria.name ? { "name": searchCriteria.name } : null,
                searchCriteria.fatherName ? { "fatherName": searchCriteria.fatherName } : null
            ].filter(criteria => criteria !== null)  // Filter out null criteria
        });

        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


// SEARCH DATA
app.get('/student/search/:key', async (req, res) => {
    const data = await Student.find({
        "$or": [
            {"name": {$regex:req.params.key}},
            {"fatherName": {$regex:req.params.key}}
        ]
    })
    res.send(data);

})

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
        console.log(req.query);
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || 10; 

        const skip = (page - 1) * pageSize;
        
        const totalCount = await Student.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);
        console.log(
            'page:' + page,
            'totalPages:' + totalPages,
            'totalCount:' + totalCount,
);
        if (page > totalPages) {
            res.status(404).send(new REQRESPONSE(404, {}, "Data not found"));
        } else {
            const data = await Student.find().skip(skip).limit(pageSize);
            // console.log(data);
            const response = new LISTRESPONSE(200, data, 'Students Retrieved Successfully', totalCount, page, pageSize);
            res.status(200).send(response);
        }

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

app.listen(process.env.PORT, ()=> {
    console.log("Server is listening on port " + process.env.PORT);
})