var crawlerEngine = require('./crawlerEngine');

/**
* Login Step. Given someone's username or password, we 
*   either resolve or reject the promise based on whether 
*   their username/password was valid or invalid
* @param {String} username
* @param {String} password
* @returns {Promise}
*/
function loginStep(username, password) {
    
    return crawlerEngine().then(function (crawlerObj) {
        
        return new Promise(function (resolve, reject) {
            if (!username || !password) {
                reject(new Error("Invalid credentials"));
            }

            if (username.length !== 7) {
                reject(new Error("Invalid credentials"));
            }
            
            var crawler = crawlerObj.crawler;
            
            crawler.once("auth", function (authResponse) {
                if (authResponse === "error") {
                    reject(new Error("Invalid credentials"));
                    return;
                }
                resolve(crawlerObj);
            });
            
            crawler.then([{
                username: username,
                password: password
            }, function () {
                this.sendKeys("#content #login form input#username", 
                              username);
                this.sendKeys("#content #login form input#password", 
                              password);
                this.click("#content #login form input#submit");
            }]);
            crawler.then(function () {
                if (this.exists("#discovery_error #login_error")) {
                    this.emit("auth", "error");
                } else {
                    this.emit("auth", "success");
                }
            });
        });
        
    });
    
}

module.exports = exports = loginStep;