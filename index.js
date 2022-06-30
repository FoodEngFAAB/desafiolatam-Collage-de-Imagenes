// Se importan las librerias
const express = require('express')
const app = express()
const expressFileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const fs = require('fs')

//Disponibiliza puerto
const port = 3000
app.listen(port)
console.log(`Servidor en puerto ${port}`)

//Middlewares y Objeto de COnfiguración
app.use(expressFileUpload({
    //Establece en 5MB el tamaño máximo del archivo a subir
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'El tamaño del archivo es superior al limite permitido (5 MB).',
}))

// Middleware body-parser para formateo de JSON; disponibiliza body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))

//Ruta raíz
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

//Ruta POST para almacenar imágenes en public 8carpeta pública del servidor).
app.post('/img', (req, res) => {
    const { target_file } = req.files
    const { posicion } = req.body
    target_file.mv(`${__dirname}/public/img/imagen-${posicion}.jpeg`, (err) => {
        res.redirect('/collage')
    })
    console.log(`Se agregó exitosamente imagen-${posicion}.jpeg en ${__dirname}/public/img/`)
})

// Ruta GET "/deleteImg/:nombre" que elimina la imagen al hacer click en el número de ella
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params
    fs.unlink(`${__dirname}/public/img/${nombre}`, (err) => {
        res.redirect("/collage")
        console.log(`${nombre} eliminada exitosamente`)
    })
})

//Ruta GET "/collage" que devuelve el collage
app.get("/collage", (req, res) => {
    res.sendFile(__dirname + '/collage.html')
})

