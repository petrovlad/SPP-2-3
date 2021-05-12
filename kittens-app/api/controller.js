const Deadline = require('./models/deadline').Deadline;
const User = require('./models/user').User;
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const secret = getSecret();

/*
 * Deadlines:
 *
 * 1. getDeadlines
 * 2. createDeadline
 * 3. getDeadline
 * 4. updateDeadline
 * 5. deleteDeadline
 */

exports.getDeadlines = (req, res) => {
    const token = req.headers.authorization?.slice(7);

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            res.status(401).json('Error: Unauthorized: ' + err.message);
        }

        const authorId = JSON.parse(decoded.user)._id;

        Deadline.find({authorId: authorId}, function (err, deadlines) {
            if (err) {
                res.status(404).send(err);
            }

            res.json(deadlines);
        });
    });
}

exports.createDeadline = (req, res) => {
    const newDeadline = new Deadline(req.body);

    newDeadline.save(function (err, deadline) {
        if (err) {
            res.status(404).send(err);
        }

        res.json(deadline);
    });
}

exports.getDeadline = (req, res) => {
    Deadline.findById(req.params.deadlineId, function (err, deadlines) {
        if (err) {
            res.status(404).send(err);
        }

        res.json(deadlines);
    });
}

exports.updateDeadline = (req, res) => {
    Deadline.findOneAndUpdate({_id: req.params.deadlineId}, req.body, {new: true}, function (err, deadline) {
        if (err) {
            res.send(err);
        }

        res.json(deadline);
    });
}

exports.deleteDeadline = (req, res) => {
    Deadline.remove({_id: req.params.deadlineId}, function (err, deadlines) {
        if (err) {
            res.status(404).send(err);
        }

        res.json(deadlines);
    });
}

/*
 * User:
 *
 * 1. registerUser
 * 2. loginUser
 * 2. getUsers
 */

exports.registerUser = (req, res) => {
    req.body.password = md5(req.body.password);
    const newUser = new User(req.body);

    newUser.save(function (err, user) {
        if (err) {
            res.status(404).send(err);
        }

        res.json(JSON.stringify({jwt: jwt.sign({user: JSON.stringify(user)}, secret), user: user}));
    });
}

exports.loginUser = (req, res) => {
    req.body.password = md5(req.body.password);

    User.findOne({email: req.body.email}, function (err, user) {
        if (user) {
            if (user.checkPassword(req.body.password)) {
                res.json(JSON.stringify({jwt: jwt.sign({user: JSON.stringify(user)}, secret), user: user}));
            }
        }
        res.status(404).send();
    });
}

exports.getUsers = (req, res) => {
    User.find({}, function (err, users) {
        if (err) {
            res.status(405).send(err);
        }

        res.json(users);
    });
}

function getSecret() {
    const fs = require('fs');
    const data = fs.readFileSync('jwt-config.json', 'utf8');
    return JSON.parse(data).secret;
}
