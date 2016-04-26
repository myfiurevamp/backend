var dbQuery = require('../utils/dbQuery'), 
    studentInfoStep = require('../crawler/studentInfoStep'),
    jwt = require('jsonwebtoken');

/**
* Checks if a student, given their username and password, 
*   is valid against the MyFIU system.
* @param {string} req - Express Request Object
* @param {string} res - Express Response Object
*/
function login(req, res) {
    var username = req.body.username,
        password = req.body.password;
    
    // Login Step from Crawler
    dbQuery("SELECT * FROM users WHERE pantherId=$1 AND password=$2", 
           [username, password])
    .then(function (userList) {
        // User wasn't cached. Cache now.
        if (userList.length === 0) {
            return studentInfoStep(username, password)
                .then(function (studentInfoObj) {
                    dbQuery("INSERT INTO users(pantherId, email, " + 
                            "password, address, phone) VALUES ($1, " + 
                            "$2, $3, $4, $5)", 
                            [username, studentInfoObj.email, password, 
                             studentInfoObj.address, studentInfoObj.phone]);
                });
        }
        return;
    })
    .then(function () {
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
    }, function (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    });
    
}

module.exports = exports = login;