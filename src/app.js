//imports
const express = require('express')
const cors = require('cors')

//inicialización de la app
var app = express()
app.use(cors())
    //CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-cliente-token, x-client-secret, Authorization");
    next();
});
//DEFINICIÓN DE PUERTO
app.set('port', 3000)

//Pagina de error de servidor
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})
app.use(require('./routes/empresa'))

//Listen
app.listen(app.get('port'), () => {
    console.log('Express started on ' + app.get('port'))
})