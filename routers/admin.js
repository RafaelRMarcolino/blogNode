const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
riquerie("../models/Categorias")
const Categorias = mongoose.model('categorias');

router.get("/", (req,res) => {
    res.render("index.handlebars")
});


router.get("/postagens", (req,res) => {
    res.render("postagens.handlebars")
});


router.get("/postagens/add", (req,res) => {
    res.render("addpostagens.handlebars")
});


module.exports = router;


