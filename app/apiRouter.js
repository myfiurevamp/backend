var express = require('express'),
    apiRouter = express.Router(), 
    authRouter = express.Router(),
    
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    
    loginController = require('./controllers/login'),
    presentCoursesController = require('./controllers/presentCourses'),
    allCoursesController = require('./controllers/allCourses'),
    infoController = require('./controllers/info');

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));

apiRouter.all(express().mountpath, function (req, res) {
    res.status(200).json({
        status: 200,
        message: "Welcome to MyFIU-Revamped Backend API", 
    });
});
/* Login Route */
apiRouter.post('/login', loginController);
/* Auth Routes - JWT Middleware */
authRouter.use('/', function (req, res, next) {
    var jwtToken, 
        decodedToken;
    
    req.auth = {};
    
    if (req.header('Authorization')) {
        jwtToken = req.header('Authorization').replace('Bearer ', '');
    }
    else if (req.body.token) {
        jwtToken = req.body.token;
    }
    else {
        res.status(400).json({
            status: 400,
            message: "Error - JWT Token required"
        });
        return;
    }
    
    try {
        decodedToken = jwt.verify(jwtToken, process.env.ENCRYPTION_KEY);
    } catch (e) {
        res.status(400).json({
            status: 400,
            message: "Invalid JWT Token"
        });
        return;
    }
    
    req.auth.username = decodedToken.username;
    req.auth.password = decodedToken.password;
    next();
});

/* Authenticated Routes */
authRouter.all('/courses/all', allCoursesController);
authRouter.all('/courses/present', presentCoursesController);
authRouter.all('/info', infoController);

apiRouter.use('/auth', authRouter);

module.exports = exports = apiRouter;