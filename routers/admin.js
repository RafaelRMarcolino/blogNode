const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categorias")
require("../models/Postagem");
const Categorias = mongoose.model('categorias');
const Postagems = mongoose.model('postagem')
const {eAdmin} = require("../helpers/eAdmin")


router.get("/", eAdmin,  (req,res) => {
    res.render("index.handlebars")
});

router.get("/categorias", eAdmin,  (req,res) => {
    Categorias.find().sort({data: 'desc'}).then((categorias) => {
        res.render("categorias.handlebars", {categorias : categorias.map(categorias => categorias.toJSON())})

    }).catch((err) => {
        console.log("erro ao mostrar a categoria ", err )
    })
    
});



router.get("/categorias/add", eAdmin, (req,res) => {

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
    
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    
    Categorias.findOne({_id: req.params.id}).lean().then((categorias) => {
        res.render("edit.handlebars", {categorias : categorias})
    }).catch((err) => {
        console.log("erro " + err)
    })     
})

router.post("/categorias/edit", eAdmin, (req, res) => {
    
    Categorias.findOne({_id: req.body.id}).then((categorias) => {

        
        categorias.nome = req.body.nome,
        categorias.slug = req.body.slug

        categorias.save().then(() => {

            req.flash("success_msg", "editado com sucesso")
            res.redirect("/admin/categorias")

        }).catch((err) => {
            req.flash("erro_msg", "nao")

            res.redirect("/admin/categorias")
            console.log("errou "+ err)
        })

})
})

router.post("/categorias/del", eAdmin, (req, res) => {
    Categorias.deleteOne({_id: req.body.id}).then(() => {
        req.flash("erro_msg", "Deletado com  sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        console.log("erro ao deletar" + err)
        res.redirect("admin")
    })
})


//Postagens
router.get("/postagens", eAdmin, (req,res) => {
    Postagems.find().populate('categorias').sort({data:'desc'}).lean().then((postagens) => {

        res.render("postagens.handlebars", {postagens: postagens})
    }).catch((err) => {
        console.log('erro ao carregar post' + err)
        res.redirect('admin'+ err)
    })
})

router.get("/postagens/add", eAdmin, (req,res) => {
    Categorias.find().lean().then((categorias) => {
        res.render("addpostagens", {categorias : categorias})

    }).catch((err) => {
        console.log("erro ao mostrar categorias " + err)
        res.redirect("admin")
    })
})

router.post("/postagens/add/new", eAdmin, (req,res) => {
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


router.get("/postagens/adit/:id", eAdmin, (req, res) =>{
    
    Postagems.findOne({_id: req.params.id}).lean().then((postagems) => {
        
        Categorias.find().lean().then((categorias) => {
            res.render('editpost', {categorias: categorias, postagems: postagems})
        }).catch((err) => {
            console.log('nao funcionou categorias')
            req.flash('erro_msg',  'erro com categoria')
            res.redirect('admin')
        })
        
    }).catch((err) => {
        console.log('postagens erro' + err )
        req.flash('erro_msg', 'erro ao mostrar postagens')
        res.redirect('admin')
    })
});


router.post("/postagens/edit/new", eAdmin, (req, res) => {

    postagems.titulo = req.body.titulo,
    postagems.slug = req.body.slug,
    postagems.descricao = req.body.descricao,
    postagems.conteudo = req.body.conteudo,
    categorias.categorias = req.body.categorias

    Postagems.save().then((postagems) => {

        req.flash("success_msg", "editar salvo com sucesso")
        console.log("salvo edicao com sucesso")
        res.redirect('admin/postagens')

    }).catch((err) => {
        req.flash("erro_msg", "erro ao salvar")
        console.log('deu')
        res.redirect('admin')
    })
})



    
router.post("/postagens/del/:id", eAdmin, (req, res)=>{
    Postagems.findOne({_id: req.body.id}).deleteOne().then(() => {
        req.flash("success_msg", "sucesso ao deletar")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("erro_msg", "erro ao cadastrar")
        res.redirect("/")
    })
})




module.exports = router;


