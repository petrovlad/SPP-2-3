const jwt = require('jsonwebtoken');
const secret = getSecret();

module.exports = function (req, res, next) {
    const token = req.headers.authorization?.slice(7);

    if (!token && (req.url === '/login' || req.url === '/register')) {
        console.log(req.body);
        next()
        return;
    }

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            err.message = 'Error: Unauthorized: ' + err.message;
            err.status = 401;
            next(err);
            return;
        }
        next();
    });
}

function getSecret() {
    const fs = require('fs');
    const data = fs.readFileSync('jwt-config.json', 'utf8');
    return JSON.parse(data).secret;
}
