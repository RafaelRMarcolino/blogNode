const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuarios")
const Usuarios = mongoose.model('usuarios')
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get('/registros', (req, res) => {

    res.render("usuarios/registros.handlebars")
})

//passport.authenticate("local", {
      //  successRedirect: "/",
        //failureRedirect: "/usuarios/login",
        //failureFlash: true 
    //})(req, res, next)

    


router.post('/registros', (req, res) => {

    var erro = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erro.push({texto: "erro no nome"})
    }
   
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erro.push({texto: "erro no nome"})
    }

    if(req.body.senha.length < 4 ){
        erro.push({texto: "senha pequena"})
    }

    if(req.body.senha != req.body.senha2){
        erro.push({texto: "senhas diferentes"})
    }

    if(erro.length > 0){
        res.render("usuarios/registros", {erro: erro})
    }

    else{

        Usuarios.findOne({email: req.body.email}).then((usuarios) => {

            if(usuarios){
                req.flash("erro_msg", "erro no email")
                res.redirect("/usuarios/registros")
            }
            else{

                const novoUsuarios = new Usuarios({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    eAdmin: 1
                })
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuarios.senha, salt, (erro, hash) => {

                        if(erro){
                            req.flash("erro_msg", "erro ao cadastrar")
                            res.redirect("/")
                        }

                        novoUsuarios.senha = hash

                        novoUsuarios.save().then(() =>{
                            req.flash("success_msg", "sucesso")
                            res.redirect("/")

                        }).catch((erro) => {
                            req.flash("erro_msg", "erro")
                            res.redirect("/")
                        })

                    } )
                })
            }
        }).catch((erro) =>{
            req.flash("erro_msg", "erro ao cadastrar")
            res.redirect("/")
        })
    }
})


router.get("/login", (req, res) => {
    res.render("usuarios/login.handlebars")

})


router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
    
})


router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})


module.exports = router
