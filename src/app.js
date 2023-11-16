const express = require('express');
const path=require('path');
const {engine} = require('express-handlebars');
const routerProducts = require('./routes/products.router');
const {Server} = require('socket.io')
const routerCarts = require('./routes/carts.router');
const routerViews = require('./routes/views.router');




const PORT = 8080
const app = express();

const server = app.listen(PORT, () => console.log("Server online port " + PORT))

const io = new Server(server)


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'/public')));



app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));


app.use('/', routerViews)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

module.exports = {io}



