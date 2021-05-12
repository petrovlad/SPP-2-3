const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const cors = require('cors');

const corsOptions = {origin: '*', optionsSuccessStatus: 200};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(jwtMiddleware);

const deadlineRoutes = require('./api/routes');
deadlineRoutes(app);

app.listen(port);

console.log('RESTful API server started on port ' + port);

app.use(function handleDatabaseError(error, req, res, next) {
    res.status(error.status).json(error.message);
});
