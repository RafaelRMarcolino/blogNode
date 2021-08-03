const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport")
require("../models/Usuarios")
const Usuarios = mongoose.model("usuarios")


module.exports = function (passport) {

    passport.use(new localStrategy({usernameField: email}, (email, senha, done) =>{

        Usuarios.findOne({email: email}).then((usuarios) => {
            if(!usuarios){
                return done(null, false, {message: "erro"})
            }
            else{
                bcrypt.compare(senha, usuarios.senha, hash, (erro ,bash) => {
                    if(bash){
                        return done(null, user)
                    }
                    else{
                        return done(null, false, {messege: "erro ao cadastrar"})
                    }
                })
            }
        })
    }))
}


passport.serializeUser((usuarios, done) => {
    done(null, usuarios.id)
})

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, usuarios))
    done(err, user)

})

