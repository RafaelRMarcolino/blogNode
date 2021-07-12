const mongoose = require("mongoose");
const Schema = mongoose.Schema

const Postagem = new Schema({

    titulo: {
        type: String,
    },
    slug: {
        type: String,
        riquered: true
    },
    descricao: {
        type: String,
        riquered: true
    },

    conteudo: {
        type: String,
        riquered: true
    },
    categorias: {
        type: Schema.Types.ObjectId,
        riquered: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model("postagem", Postagem);
