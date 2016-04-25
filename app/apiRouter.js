var express = require('express'),
    apiRouter = express.Router(), 
    authRouter = express.Router(),
    
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    
    loginStep = require('./crawler/loginStep'),
    courseListStep = require('./crawler/courseListStep');

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));

apiRouter.all(express().mountpath, function (req, res) {
    res.status(200).json({
        status: 200,
        message: "Welcome to MyFIU-Revamped Backend API", 
    });
});
/* Login Route */
apiRouter.post('/login', function (req, res) {
    
    // Login Step from Crawler
    loginStep(req.body.username, req.body.password).then(function () {
        // Generate jwtToken
        var jwtToken = jwt.sign({
            username: req.body.username,
            password: req.body.password
        }, process.env.ENCRYPTION_KEY);
        
        res.status(200).json({
            status: 200,
            message: "Successfully logged in", 
            data: {
                jwtToken: jwtToken
            }
        });
    }, function () {
        res.status(400).json({
            status: 400,
            message: "Incorrect credentials"
        });
    });
    
});
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
authRouter.post('/courses/all', function (req, res) {
    courseListStep(req.auth.username, req.auth.password)
        .then(function (courseList) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: courseList
            });
        }, function (error) {
            res.status(400).json({
                status: 400,
                message: error.message
            });
        });
});
authRouter.post('/courses/present', function (req, res) {
    courseListStep(req.auth.username, req.auth.password)
        .then(function (courseList) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: courseList.filter(function (courseObj) {
                    return courseObj.semesterLabel === "Spring Term 2016";
                })
            });
        }, function (error) {
            res.status(400).json({
                status: 400,
                message: error.message
            });
        });
});

apiRouter.use('/auth', authRouter);

module.exports = exports = apiRouter;