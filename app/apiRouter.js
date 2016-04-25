var apiRouter = (require('express')).Router(), 
    authRouter = (require('express')).Router(),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    
    loginStep = require('./crawler/loginStep');

apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));

/* Login Route */
apiRouter.post('/login', function (req, res) {
    
    // Login Step from Crawler
    loginStep(req.body.username, req.body.password).then(function () {
        // Generate jwtToken
        var jwtToken = jwtToken.sign({
            username: req.body.username,
            password: req.body.password
        }, process.env.ENCRYPTION_KEY);
        
        res.status(200).json({
            status: 200,
            message: "Successfully logged in", 
            data: jwtToken
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

apiRouter.use('/auth', authRouter);

module.exports = exports = apiRouter;