const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require('./utils/ExpressError');
const flash = require("connect-flash");
const session = require('express-session');



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) 

app.get("/", (req, res)=>{
    res.render("Riz/home")
})

app.get("/info", (req, res)=>{
    res.render("Riz/info")
})

app.get("/location", (req, res)=>{
    res.render("Riz/location")
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, (req, res)=>{
    console.log("LISTENING ON PORT 3000!!")
})
