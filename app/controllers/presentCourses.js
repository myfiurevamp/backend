var dbQuery = require('../utils/dbQuery'), 
    courseListStep = require('../crawler/courseListStep');

/**
* Get a list of all the courses a logged-in student is 
*   currently taking
* @param {Object} req - Express Request Object
* @param {Object} res - Express Response Object
*/
function presentCourses(req, res) {
    var username = req.auth.username,
        password = req.auth.password;
    
    dbQuery("SELECT id, name, semesterMonth, semesterYear, " + 
            "grade, units FROM courses WHERE pantherId=$1 AND " + 
            "semesterMonth=$2 AND semesterYear=$3", 
            [username, "Spring", "2016"])
        .then(function (courseList) {
            if (courseList.length === 0) {
                return courseListStep(username, password)
                    .then(function (courseList) {
                        courseList
                            .filter(function (courseObj) {
                                return courseObj.semesterLabel === 
                                    "Spring Term 2016";
                            })
                            .forEach(function (courseObj) {
                                dbQuery("INSERT INTO courses (pantherId, " + 
                                        "id, name, semesterMonth, " + 
                                        "semesterYear, grade, units) " + 
                                        "VALUES ($1, $2, $3, $4, $5, $6, $7)", 
                                [username, courseObj.id, courseObj.name, 
                                 courseObj.semesterMonth, 
                                 courseObj.semesterYear,
                                 courseObj.grade, 
                                 courseObj.units]);
                            });
                    });
            }
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


module.exports = exports = presentCourses;