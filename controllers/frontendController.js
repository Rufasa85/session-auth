const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
    db.Turtle.findAll({
        include: [db.User]
    }).then(turtles => {
        const turtlesJson = turtles.map(turtObj => {
            return turtObj.toJSON()
        })
        console.log(turtlesJson)
        const hbsObj = {
            user: req.session.user,
            turtles: turtlesJson
        }
        res.render("index", hbsObj);
    })
})

router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user })
})
router.get("/signup", (req, res) => {
    res.render("signup", { user: req.session.user })
})

router.get('/myprofile', (req, res) => {
    if (req.session.user) {
        db.User.findOne({
            where: {
                id: req.session.user.id
            },
            include: [db.Turtle]
        }).then(userData => {
            const userDataJSON = userData.toJSON()
            res.render('profile', { user: userDataJSON })
        })
    } else {
        res.redirect("/login")
    }
})

router.get("/newturtle", (req, res) => {
    if (req.session.user) {
        res.render("createTurtle", { user: req.session.user })
    } else {
        res.redirect("/login")
    }
})

router.get("/turtles/edit/:id",(req,res)=>{
    if(req.session.user){
        db.Turtle.findOne({
            where:{
                id:req.params.id
            }
        }).then(turtle=>{
            if(!turtle){
                return res.status(404).send("no turtle found")
            }
            else if(turtle.UserId===req.session.user.id){
                const turtleJSON = turtle.toJSON();
                res.render("editTurtle",{
                    user:req.session.user,
                    turtle:turtleJSON
                })
            } else {
                res.status(401).send('NOT YOUR TURTLE!!!!!')
            }
        })
       
    } else{
        res.status(401).send("not logged in")
    }
})

module.exports = router