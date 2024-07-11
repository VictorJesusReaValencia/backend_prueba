const express = require('express');
const multer = require('multer');
const path = require('path');
const Correspondencia = require('../models/correspondencia'); // Asegúrate de importar tu modelo Correspondencia
const CorrespondenciaControlador = require("../controllers/correspondenciaControlador")
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./imagenes/correspondencia");
  },
  filename: async function(req, file, cb) {
    try {
      const correspondencia = await Correspondencia.findById(req.params.id); // Suponiendo que estás usando Mongoose para interactuar con MongoDB
      if (!correspondencia) {
        return cb(new Error('Correspondencia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const nombreArchivo = `Correspondencia,${correspondencia.titulo}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});
const subidas = multer({ storage: almacenamiento });


router.get('/prueba-correspondencia', CorrespondenciaControlador.pruebaCorrespondencia);
router.post("/registrar",CorrespondenciaControlador.registrarCorrespondencia)
router.post('/registrar-imagen/:id', [subidas.single("file0")], CorrespondenciaControlador.cargarFotografia);
router.delete('/borrar/:id', CorrespondenciaControlador.borrarCorrespondencia);
router.put('/editar/:id', CorrespondenciaControlador.editarCorrespondencia);
router.get('/listar-temas', CorrespondenciaControlador.obtenerTemasCorrespondencia);
router.get('/tema/:id', CorrespondenciaControlador.listarPorTema);
router.get('/lib/:id', CorrespondenciaControlador.obtenerCorrespondenciaPorID);

module.exports = router;