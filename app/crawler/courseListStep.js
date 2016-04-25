var loginStep = require('./loginStep');

/**
* Course List step. Retrieves all of the courses the student 
*   has taken
* @param {String} username
* @param {String} password
* @returns {Promise}
*/
function courseListAllStep(username, password) {

    return loginStep(username, password).then(function (crawlerObj) {
        
        return new Promise(function (resolve, reject) {
            var crawler = crawlerObj.crawler;
            
            crawler.once("allCoursesList", function (list) {
                resolve(list);
            });
            
            // Dashboard Page
            crawler
                .waitForResource(
                    "https://psprod.fiu.edu/cs/students/" + 
                    "cache/PT_GRIDSCRIPT_win1_MIN_1.js"
                );
            crawler
                .waitForSelector("a#DERIVED_SSS_SCR_SSS_LINK_ANCHOR4");
            crawler
                .thenClick("a#DERIVED_SSS_SCR_SSS_LINK_ANCHOR4");
            
            // My Academics Page
            crawler
                .waitForSelector("iframe#ptifrmtgtframe");
            crawler
                .withFrame(0, function () {
                    this.click("a#DERIVED_SSSACA2_SSS_ACAD_HISTORY");
                });
            
            // My Course History Page
            crawler
                .withFrame(0, function () {
                    this.waitForSelector(
                        "#win1divDERIVED_" + 
                        "REGFRM1_SS_TRANSACT_TITLE"
                    );
                });
            crawler.then(function () {
                // WithFrame --->
                this.withFrame(0, function () {
                    var courseList = this.evaluate(function () {
                        return Array.prototype.slice.call(
                            document
                            .querySelectorAll("table[id='" + 
                                              "CRSE_HIST$scroll$0'] tr")
                        ).map(function (domObj) {
                            var returnedObj = Object.create(null), 
                                row = domObj.querySelectorAll("td");
                            
                            if (!domObj.querySelector("td span")) {
                                return returnedObj;
                            }
                                
                            returnedObj.id = 
                                row[0]
                                    .querySelector("span")
                                    .innerHTML;
                            returnedObj.name = 
                                row[1]
                                    .querySelector("span")
                                    .querySelector("a")
                                    .innerHTML;
                            returnedObj.semesterLabel = 
                                row[2].querySelector("span").innerHTML;
                            returnedObj.grade = 
                                row[3].querySelector("span").innerHTML;
                            returnedObj.units = 
                                row[4].querySelector("span").innerHTML;
                            
                            var semesterAsArray = 
                                returnedObj.semesterLabel.split(" ");
                            returnedObj.semesterMonth = semesterAsArray[0];
                            returnedObj.semesterYear = semesterAsArray[2];
                            
                            if (returnedObj.grade === "&nbsp;") {
                                returnedObj.grade = "";
                            }

                            return returnedObj;
                        });
                    });
                    
                    this.emit("allCoursesList", courseList);
                });
            });
            /// EndWithFrame --->
        });

    });

}
                                            

module.exports = exports = courseListAllStep;