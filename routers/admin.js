const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categorias")
const Categorias = mongoose.model('categorias');

router.get("/", (req,res) => {
    res.render("index.handlebars")
});

router.get("/categorias", (req,res) => {
    
    res.render("categorias.handlebars")
});

router.get("/categorias/add", (req,res) => {

    res.render("addcategorias.handlebars")
    })








router.post("/categorias/new", (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "erro no nome"})
        console.log("1")
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "erro no slug"})
        console.log("2")

    }

    if(req.body.nome.length <= 2){
        erros.push({texto: "erro no tamanho do nome"})
        console.log("3")


    }
    if(erros.length > 0){
        res.render("addcategorias", {erros: erros})
        console.log("4")

    }

    else{

        const novaCategoria = {
            nome : req.body.nome,
            slug : req.body.slug


        }

        new Categorias(novaCategoria).save().then(() => {

            req.flash("success_msg", "cadastrado com sucesso")
            res.redirect("/admin/categorias")
            
        }).catch((err) => {
            req.flash("erro_msg", "erro ao cadastrar")
            console.log("erro cadastro" + err)

        })

    }

    
    

    
    

    
})

module.exports = router;


