/**
* Instantiates the web crawler engine that powers our scraping needs
* @returns {Promise} - crawler object on resolve, error object on failure
*/
function crawlerEngine() {
    
    function promiseExecutor(resolve, reject) {
        var Spooky = require('spooky'),
            crawler = new Spooky({
                child: {
                    transport: "http"
                },
                casper: {
                    verbose: true,
                    logLevel: "debug",
                    userAgent: process.env.USER_AGENT,
                    XSSAuditingEnabled: false,
                    loadImages: false,
                    loadPlugins: false,
                    viewportSize: {
                        width: 1920,
                        height: 1080
                    }
                }
            }, function (error) {
                if (error instanceof Error) {
                    console.error(error);
                    throw error;
                }
                
                crawler.start(process.env.PATH_FIU);
                resolve({crawler: crawler});
                crawler.run();
            });

        crawler.on('error', function (e, stack) {
            console.error(e);
            if (stack) {
                console.log(stack);
            }
        });
        crawler.on('console', function (message) {
            console.log(message);
        });
    }
    
    return new Promise(promiseExecutor);
}

module.exports = exports = crawlerEngine;