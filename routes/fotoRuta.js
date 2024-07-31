const express = require('express');
const multer = require('multer');
const path = require('path');
const Fotografia = require('../models/fotografia'); // Asegúrate de importar tu modelo Fotografia
const pruebaControlador = require("../controllers/fotoControlador")

const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./imagenes/fotografias/");
  },
  filename: async function(req, file, cb) {
    try {
      const fotografia = await Fotografia.findById(req.params.id); // Suponiendo que estás usando Mongoose para interactuar con MongoDB
      if (!fotografia) {
        return cb(new Error('Fotografia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const nombreArchivo = `album_${fotografia.numero_album}_foto_${fotografia.numero_foto}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});

const subidas = multer({ storage: almacenamiento });

router.get('/prueba-foto', pruebaControlador.pruebaFoto);
router.get('/listar-foto', pruebaControlador.listar);
router.post('/registrar-foto', pruebaControlador.registrarfoto2);
router.post('/registrar-imagen/:id', [subidas.single("file0")], pruebaControlador.subir_foto);
router.get('/foto/:id', pruebaControlador.obtenerFotoPorID);
router.get('/listar-paises', pruebaControlador.obtenerPaises);
router.get('/listar-temas', pruebaControlador.obtenerTemas);
router.get('/listar-albumes', pruebaControlador.obtenerAlbumes);
router.get('/album/:id', pruebaControlador.listarPorAlbum);
router.get('/tema/:id', pruebaControlador.listarPorTema);
router.delete('/borrar-foto/:id', pruebaControlador.borrar);
router.put('/editar-foto/:id', pruebaControlador.editar);
router.get('/numero-por-pais/:id', pruebaControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', pruebaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', pruebaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', pruebaControlador.listarPorTemaEInstitucion);

module.exports = router;
