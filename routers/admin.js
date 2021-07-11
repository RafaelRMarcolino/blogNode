const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categorias")
const Categorias = mongoose.model('categorias');

router.get("/", (req,res) => {
    res.render("index.handlebars")
});



router.get("/categorias", (req,res) => {
    Categorias.find().then((categorias) => {
        res.render("categorias.handlebars", {categorias : categorias.map(categorias => categorias.toJSON())})

    }).catch((err) => {
        console.log("erro ao mostrar a categoria ", err )
    })
    
});



router.get("/categorias/add", (req,res) => {

    res.render("addcategorias.handlebars")
    })


router.post("/categorias/new", (req,res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "erro no nome"})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "erro no slug"})
    }

    if(req.body.nome.length <= 2){
        erros.push({texto: "erro no tamanho do nome"})
    }
    if(erros.length > 0){
        res.render("addcategorias", {erros: erros})
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


router.get("/categorias/edit/:id", (req, res) => {
    
    Categorias.findOne({_id: req.params.id}).lean().then((categorias) => {
        res.render("edit.handlebars", {categorias : categorias})
    }).catch((err) => {
        console.log("erro " + err)
    })     
})

router.post("/categorias/edit/:id", (req, res) => {
    categorias.nome = req.body.nome,
    categorias.slug = req.body.slug

    Categorias.save().then((categorias) => {

        req.flash.success_msg("success_msg", "editado com sucesso")
        res.redirect("admin/categorias")

    }).catch((err) => {
        res.redirect("admin")
        req.flash("erro_msg", "nao")
    })
})

module.exports = router;


