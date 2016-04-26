var dbQuery = require('../utils/dbQuery'),
    studentInfoStep = require('../crawler/studentInfoStep');

/**
* Get a student's set of information for the currently logged-in 
*   student
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
function info(req, res) {
    var username = req.auth.username,
        password = req.auth.password;
    
    dbQuery("SELECT pantherId, email, password, address, phone " + 
            "FROM users WHERE pantherId=$1 AND password=$2", 
            [username, password])
        .then(function (studentInfo) {
            if (studentInfo.length === 0) {
                return studentInfoStep(username, password);
            }
            return studentInfo[0];
        })
        .then(function (studentInfo) {
            if (studentInfo.password) {
                delete studentInfo.password;
            }
            if (!studentInfo.pantherId) {
                studentInfo.pantherId = username;
            }
            res.status(200).json({
                status: 200,
                message: "Success",
                data: studentInfo
            });
        }, function (error) {
            res.status(400).json({
                status: 400,
                message: error.message
            });
        });
}

module.exports = exports = info;