const express = require('express');
const multer = require('multer');
const path = require('path');
const Libro = require('../models/libros'); // Asegúrate de importar tu modelo Libro
const LibroControlador = require("../controllers/libroControlador")
const router = express.Router();

const almacenamiento = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./imagenes/libro");
  },
  filename: async function(req, file, cb) {
    try {
      const libro = await Libro.findById(req.params.id); // Suponiendo que estás usando Mongoose para interactuar con MongoDB
      if (!libro) {
        return cb(new Error('Libro no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const nombreArchivo = `Libro,${libro.titulo}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});
const subidas = multer({ storage: almacenamiento });


router.get('/prueba-libro', LibroControlador.pruebaLibro);
router.post("/registrar",LibroControlador.registrarLibro)
router.post('/registrar-imagen/:id', [subidas.single("file0")], LibroControlador.cargarFotografia);
router.delete('/borrar/:id', LibroControlador.borrarLibro);
router.put('/editar/:id', LibroControlador.editarLibro);
router.get('/listar-temas', LibroControlador.obtenerTemasLibro);
router.get('/tema/:id', LibroControlador.listarPorTema);
router.get('/lib/:id', LibroControlador.obtenerLibroPorID);

module.exports = router;