var app = (require('express'))(), 
    apiRouter = require('./app/apiRouter');

(require('node-env-file'))(__dirname + '/.env');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 
                  'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers',
                  'X-Requested-With, content-type, authorization,' + 
                  ' accept, origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === "OPTIONS") {
        return res.status(200).json({
            status: 200, 
            message: "OPTIONS request"
        });
    }
    
    next();
});

app.use('/api/' + process.env.VERSION, apiRouter);

app.listen(process.env.PORT, function () {
    console.log('Started listening at port ' + process.env.PORT);
});