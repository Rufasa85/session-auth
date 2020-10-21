const express = require('express');
const router= express.Router();
const db = require('../models');

router.get("/", (req, res) => {
    db.Turtle.findAll().then(turtles => {
        res.json(turtles)
    })
})

router.post("/", (req, res) => {
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

router.delete("/:id",(req,res)=>{
    if(req.session.user){
        db.Turtle.findOne({
            where:{
                id:req.params.id
            }
        }).then(turtle=>{
            if(turtle.UserId===req.session.user.id){

                db.Turtle.destroy({
                    where:{
                        id:req.params.id
                    }
                }).then(delTurtle=>{
                    res.json(delTurtle)
                })
            } else {
                res.status(401).send('NOT YOUR TURTLE!!!!!')
            }
        })
       
    } else{
        res.status(401).send("not logged in")
    }
})


router.put("/:id",(req,res)=>{
    if(req.session.user){
        db.Turtle.findOne({
            where:{
                id:req.params.id
            }
        }).then(turtle=>{
            if(!turtle){
                return res.status(404).send("no such turtle")
            }
            else if(turtle.UserId===req.session.user.id){
                db.Turtle.update({
                    name: req.body.name,
                    isTeenageMutantNinja: req.body.isTeenageMutantNinja,
                    age: req.body.age
                },{
                    where:{
                        id:req.params.id
                    }
                }).then(editTurtle=>{
                    res.json(editTurtle);
                }).catch(err=>{
                    res.status(500).send("ERROR ERROR ERROR!")
                })
            } else {
                res.status(401).send('NOT YOUR TURTLE!!!!!')
            }
        })
       
    } else{
        res.status(401).send("not logged in")
    }
})


module.exports = router;