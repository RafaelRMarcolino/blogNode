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

    const novaCategoria  = {
        nome : req.body.nome,
        slug : req.body.slug
    }

    new Categorias(novaCategoria).save().then(() => {
        console.log("salvo com sucesso");
    }).catch((err) => {
        console.log(" erro ao cadastrar " + err);
    })


})

module.exports = router;


