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
app.use(express.static('public'));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

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
    db.Turtle.findAll({
        include:[db.User]
    }).then(turtles=>{
        const turtlesJson = turtles.map(turtObj=>{
            return turtObj.toJSON()
        })
        console.log(turtlesJson)
        const hbsObj = {
            turtles:turtlesJson
        }
        res.render("index",hbsObj);
    })
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
            return res.redirect("/myprofile")
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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('logged out')
})

app.get("/api/turtles", (req, res) => {
    db.Turtle.findAll().then(turtles => {
        res.json(turtles)
    })
})

app.post("/api/turtles", (req, res) => {
    if (req.session.user) {
        db.Turtle.create({
            name: req.body.name,
            isTeenageMutantNinja: req.body.isTeenageMutantNinja,
            age: req.body.age,
            UserId: req.session.user.id
        }).then(newTurtle => {
            res.json(newTurtle)
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        })
    } else {
        res.status(401).send("login first you knucklehead")
    }
})

app.get("/login",(req,res)=>{
    res.render("login")
})


app.get('/myprofile',(req,res)=>{
    if (req.session.user) {
       db.User.findOne({
           where:{
               id:req.session.user.id
           },
           include:[db.Turtle]
       }).then(userData=>{
           const userDataJSON = userData.toJSON()
           res.render('profile',userDataJSON)
       })
    } else {
        res.redirect("/login")
    }
})

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});