const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categorias")
require("../models/Postagem");
const Categorias = mongoose.model('categorias');
const Postagems = mongoose.model('postagem')

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

router.post("/categorias/del",  (req, res) => {
    Categorias.deleteOne({_id: req.body.id}).then(() => {
        req.flash("erro_msg", "Deletado com  sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        console.log("erro ao deletar" + err)
        res.redirect("admin")
    })
})


//Postagens


router.get("/postagens", (req,res) => {
    res.render("postagens.handlebars")

})


router.get("/postagens/add", (req,res) => {
    Categorias.find().lean().then((categorias) => {
        res.render("addpostagens", {categorias : categorias})

    }).catch((err) => {
        console.log("erro ao mostrar categorias " + err)
        res.redirect("admin")
    })
})







router.post("/postagens/add/new", (req,res) => {
    var erros = []

        if(!req.body.titulo || typeof req.body.titulo == undefined ||req.body.titulo == null){
            erros.push({texto: "titulo vazio"})

        }
        
        if(!req.body.slug || typeof req.body.slug == undefined ||req.body.slug == null){
            erros.push({texto: "titulo slug"})

        }
        
        if(!req.body.descricao || typeof req.body.descricao == undefined ||req.body.descricao == null){
            erros.push({texto: "titulo descricao"})

        }

        if(erros.length > 0){
            res.render('addpostagens', {erros: erros})
            console.log("deu erros 8888" + erros)
        }
        
        else{


            const novaPostagem = ({
                titulo : req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categorias: req.body.categorias

            })

            new Postagems(novaPostagem).save().then(() => {

                req.flash("success_msg", "Salvo com sucesso")
                console.log("salvo com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("erro_msg", "erro ao cadastrar") 
                console.log("erro ao salvar" + err)
                res.redirect('/admin')

            })
        }
})

module.exports = router;
