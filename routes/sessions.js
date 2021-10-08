// Pull in dependencies
const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcrypt');
const {verifyToken} = require("../middlewares");

module.exports = router.post('/', async (req, res) => {

    // Validate required parameters
    if (typeof req.body.password==='undefined' || typeof req.body.username === 'undefined' ) {
        return res.status(400).send({error: "Required parameter missing"})
    }

    // Retrieve user from Mongo by username
    const user = await User.findOne({username: req.body.username});

    // Validate username & password
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).send({error: "Invalid credentials"})
    }

    // Create session into database
    const session = await Session.create({ userId: user._id });

    // 201 created
    return res.status(201).send({token: session._id})

})

module.exports = router.delete('/', verifyToken, async (req, res) => {
    try {
        await Session.deleteOne({_id: req.sessionId});
        return res.status(204).end()
    } catch (e) {
        return res.status(500).send({error: e.message})
    }
})