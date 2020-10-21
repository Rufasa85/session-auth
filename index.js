var express = require('express');
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

require("dotenv").config();

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const bcrypt = require("bcrypt");
// Static directory
// app.use(express.static('public'));

// var exphbs = require('express-handlebars');
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

const session = require('express-session')


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000
    }
}))

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/signup', (req, res) => {
    db.User.create({
        email: req.body.email,
        password: req.body.password
    }).then(newUser => {
        res.json(newUser)
    }).catch(err => {
        console.log(err);
        res.status(500).send("server error")
    })
})

app.post('/login', (req, res) => {
    db.User.findOne({
        where: { email: req.body.email }
    }).then(user => {
        //check if user entered password matches db password
        if (!user) {
            req.session.destroy();
            return res.status(401).send('incorrect email or password')

        } else if (bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = {
                email: user.email,
                id: user.id
            }
            return res.status(200).json(req.session)
        }
        else {
            req.session.destroy();
            return res.status(401).send('incorrect email or password')
        }
    })
})

app.get('/secretstuff', (req, res) => {
    if (req.session.user) {
        res.send("secretssssssss")
    } else {
        res.status(401).send("login first you knucklehead")
    }
})

app.get("/sessiondata", (req, res) => {
    res.json(req.session)
})

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.send('logged out')
})

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});