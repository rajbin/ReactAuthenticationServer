const passport = require('passport');
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const requireAuth = require('../middlewares/requireAuth');

module.exports = (app) => {
    app.post('/api/register', Authentication.register);

    app.post(
        '/api/login',
        passport.authenticate('local', { session: false }),
        Authentication.login
    );
};
