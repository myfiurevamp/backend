var dbQuery = require('../utils/dbQuery'),
    courseListStep = require('../crawler/courseListStep');

/**
* Get a list of all courses a logged-in student has 
*   taken until now.
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
function allCourses(req, res) {
    var username = req.auth.username,
        password = req.auth.password;
    
    dbQuery("SELECT id, name, semesterMonth, semesterYear, " + 
            "grade, units FROM courses WHERE pantherId=$1", 
            [username])
        .then(function (courseList) {
            // Database hasn't cached courseList. Cache now.
            if (courseList.length === 0) {
                return courseListStep(username, password)
                    .then(function (courseList) {
                        courseList.forEach(function (courseObj) {
                            dbQuery("INSERT INTO courses (pantherId, id, " +  
                                "name, semesterMonth, semesterYear, grade, " + 
                                "units) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
                                [username, courseObj.id, courseObj.name, 
                                 courseObj.semesterMonth, 
                                 courseObj.semesterYear,
                                 courseObj.grade, 
                                 courseObj.units]);
                        });
                        return courseList;
                    });
            }
            // Database has cached courseList. Use it
            return courseList;
        })
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
}

module.exports = exports = allCourses;