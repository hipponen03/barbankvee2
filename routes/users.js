// Pull in dependencies
const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const {verifyToken} = require("../middlewares");

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

        // Create account
        const account = await new Account({
            userId: user._id,
            account_number: process.env.BANK_PREFIX + Math.floor(Math.random()*1e9).toString(),
            currency: 'euro',
            balance: 10000,
            name: 'Main'
        }).save();

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

module.exports = router.get('/current', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        // 200 Success
        res.status(200).send({
            name: user.name,
            username: user.username,
            accounts: await Account.find({userId: req.userId})
        })
    } catch (e) {
        if(req.params._id !== req.userId) {
            res.status(403).send({error: "Forbidden"});
        }
    }
})