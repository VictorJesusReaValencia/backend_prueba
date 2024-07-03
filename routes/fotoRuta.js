// routes/fotoRuta.js
const express = require('express');
const router = express.Router();
const pruebaControlador = require('../controllers/fotoControlador');
const multer = require("multer")


const almacenamiento = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./imagenes/fotografias/")

    },

    filename: function(req,file,cb) {
        cb(null, "fotografia" + Date.now() + file.originalname) 

    }
})

const subidas = multer({storage: almacenamiento})

router.get('/prueba-foto', pruebaControlador.pruebaFoto);
router.get('/listar-foto', pruebaControlador.listar);
router.post('/registrar-foto', pruebaControlador.registrarfoto2);
router.post('/registrar-imagen/:id',[subidas.single("file0")], pruebaControlador.subir_foto);
router.get('/foto/:id', pruebaControlador.obtenerFotoPorID);
router.get('/listar-paises', pruebaControlador.obtenerPaises);
router.get('/listar-temas', pruebaControlador.obtenerTemas);
router.get('/listar-albumes', pruebaControlador.obtenerAlbumes);
router.get('/album/:id', pruebaControlador.listarPorAlbum);


module.exports = router;