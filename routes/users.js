// Pull in dependencies
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Handle POST /users
module.exports = router.post('/', async (req, res) => {
    try {

        // Save user to DB
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        }).save()

        // Hash password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw Error(JSON.stringify(err))
            user.password = hash;
            user.save();
        });

        // 201 Created
        res.status(201).end()
    } catch (e) {

        // 422 Parameter(s) value too short/long
        if (/is (longer|shorter) than the (maximum|minimum)/.test(e.message)) {
            return res.status(422).send({error: e.message})
        }

        // 400 Parameter(s) missing
        if (/user validation failed:/.test(e.message)) {
            return res.status(400).send({error: e.message})
        }

        // 409 Username already exists
        if (/E11000 duplicate key error collection:/.test(e.message)) {
            return res.status(409).send({error: "Username already exists"})
        }

        // 500 Unknown error
        return res.status(500).send({error: e.message})
    }
})