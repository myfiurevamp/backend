var loginStep = require('./loginStep');

/**
* Student Info step. Retrieves basic student information
* @param {String} username
* @param {String} password
* @returns {Promise}
*/
function studentInfoStep(username, password) {

    return loginStep(username, password).then(function (crawlerObj) {
        
        return new Promise(function (resolve, reject) {
            var crawler = crawlerObj.crawler;
            
            crawler.once("info", function (infoObj) {
                resolve(infoObj);
            });
            
            // Dashboard Page
            crawler
                .waitForResource(
                    "https://psprod.fiu.edu/cs/students/" + 
                    "cache/PT_GRIDSCRIPT_win1_MIN_1.js"
                );
            crawler
                .waitForSelector("#DERIVED_SSS_SCL_SSS_LONGCHAR_1");
            crawler
                .waitForSelector("#DERIVED_SSS_SCL_DESCR50");
            crawler
                .waitForSelector("#DERIVED_SSS_SCL_EMAIL_ADDR");
            
            crawler.then(function () {
                var infoObj = this.evaluate(function () {
                    var address = 
                        document
                            .querySelector("#DERIVED_SSS_SCL_SSS_LONGCHAR_1")
                            .innerHTML,
                        phone = 
                        document
                            .querySelector("#DERIVED_SSS_SCL_DESCR50")
                            .innerHTML,
                        email = 
                        document
                            .querySelector("#DERIVED_SSS_SCL_EMAIL_ADDR")
                            .innerHTML;
                    
                    address = address.replace(/\n/g, ", ");
                    address = address.replace(/<br>/g, "");
                    phone = phone.replace(/\/|-/g, "");
                    
                    return {
                        address: address,
                        phone: phone,
                        email: email
                    };
                });
                
                this.emit("info", infoObj);
            });
        });

    });

}
                                            

module.exports = exports = studentInfoStep;