const express = require('express');
const multer = require('multer');
const path = require('path');
const Iconografia = require('../models/iconografia'); // Asegúrate de importar tu modelo Iconografia
const IconografiaControlador = require("../controllers/iconografiaControlador")
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./imagenes/iconografia");
  },
  filename: async function(req, file, cb) {
    try {
      const iconografia = await Iconografia.findById(req.params.id); // Suponiendo que estás usando Mongoose para interactuar con MongoDB
      if (!iconografia) {
        return cb(new Error('Iconografia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const nombreArchivo = `Iconografia,${iconografia.tipo_iconografia}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});
const subidas = multer({ storage: almacenamiento });

router.get('/prueba-iconografia', IconografiaControlador.pruebaIconografia);
router.post("/registrar",IconografiaControlador.registrarIconografia)
router.post('/registrar-imagen/:id', [subidas.single("file0")], IconografiaControlador.cargarFotografia);
router.delete('/borrar/:id', IconografiaControlador.borrarIconografia);
router.put('/editar/:id', IconografiaControlador.editarIconografia);
router.get('/listar-temas', IconografiaControlador.obtenerTemasIconografia);
router.get('/tema/:id', IconografiaControlador.listarPorTema);
router.get('/icon/:id', IconografiaControlador.obtenerIconografiaPorID);

module.exports = router;







