var pg = require('pg');

/**
* Interfaces with the database, allowing us to 
*   execute SQL-based commands
* @param {string} sqlQuery - Prepared Query to execute
* @param {[]} queryValues - Corresponding data to execute query with
* @param {Promise} resolved on success, reject on failure
*/
function dbQuery(sqlQuery, queryValues) {
    
    return new Promise(function (resolve, reject) {
        pg.connect(process.env.DATABASE_URI, function (err, client, done) {
            // Handle Errors
            if (err) {
                if (client) {
                    done(client);
                } else {
                    done();
                }
                reject(err);
                return;
            }
            
            // Query Object
            var values = queryValues || [], 
                query = client.query(sqlQuery, values),
                resultList = [], 
                
                rowCallback = function (row) {
                    resultList.push(row);
                },
                errorCallback = function (error) {
                    done();
                    reject(error);
                };
            
            query.on('row', rowCallback);
            query.on('error', errorCallback);
            
            query.on('end', function () {
                query.removeListener('row', rowCallback);
                query.removeListener('error', errorCallback);
                done();
                resolve(resultList);
            });
        });
    });
}

module.exports = exports = dbQuery;