module.exports = (app) => {
    const deadlines = require('./controller');

    app.route('/deadlines')
        .get(deadlines.getDeadlines)
        .post(deadlines.createDeadline);

    app.route('/deadlines/:deadlineId')
        .get(deadlines.getDeadline)
        .put(deadlines.updateDeadline)
        .delete(deadlines.deleteDeadline);

    app.route('/login')
        .post(deadlines.loginUser);

    app.route('/register')
        .post(deadlines.registerUser);

    // ToDo: delete
    app.route('/users')
        .get(deadlines.getUsers);
}
