const express = require('express');
require('dotenv').config();
const path = require('path');
const ejs = require('ejs');
const app = express();
var Router = require('./router/routes');
const config = require('./config');
var cors = require('cors')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set global variables for EJS views
app.use((req, res, next) => {
    res.locals.API_URL = config.API_URL; // Make API_URL available in all EJS views
    res.locals.PUBLIC_URL = config.PUBLIC_URL;
    // console.log("API_URL set in res.locals: ", res.locals.API_URL);
    next();
});
 
app.use(async (req, res, next) => {
    res.renderWithLayout = async (view, options = {}) => {
        try {
            const combinedOptions = { ...res.locals, ...options };
            const body = await ejs.renderFile(path.join(__dirname, 'views', view + '.ejs'), combinedOptions);
            // console.log(options);
            const layoutOptions = { ...options, body };
            res.render('layout', layoutOptions);
        } catch (err) {
            next(err);
        }
    };
    next();
});

Router(app);



app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});


// 404 error handler - catches all undefined routes
app.use((req, res, next) => {
    res.status(404).render('pages/page_404', { 
        title: 'Page Not Found',
        message: 'Sorry, the page you are looking for does not exist.'
    });
});

// app.use((req, res, next) => {
//     res.status(404).render('pages/page_404'); 
// });

const port = config.PORT ;

app.listen(port, () => {
    console.log(`Server running at PORT:${port}/`);
});