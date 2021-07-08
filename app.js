const express = require("express");
const app = express();
const handlebars  = require('express-handlebars');
const bodyParser = require('body-parser')
const admin = require("./routers/admin");
const path = require("path");
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
 


mongoose.connect('mongodb://localhost:27017/blogt', {useNewUrlParser: true}).then(() => {
    console.log("conecctado db")
}).catch((err) => {
    console.log("erro" + err)
}) 


//session
app.use(session({
  secret: 'blogt',
  resave: true,
  saveUninitialized: true,
}))

//flash
app.use(flash());


app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
});


app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send("Deus e bom");
});

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use("/admin", admin)

app.listen(8081, () => {
    console.log("Conectado com sucesso ");
});


