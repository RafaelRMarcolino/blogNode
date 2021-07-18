const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Usuarios")
const Usuarios = mongoose.model('usuarios')
const bcrypt = require("bcryptjs")

router.get('/registros', (req, res) => {

    res.render("usuarios/registros.handlebars")
})


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


        
    }
})

module.exports = router;
