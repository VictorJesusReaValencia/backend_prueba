const express = require('express');
const multer = require('multer');
const path = require('path');
const Libros = require('../models/libros'); // Asegúrate de importar tu modelo Libros
const LibrosControlador = require("../controllers/libroControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/libros");
  },
  filename: async function (req, file, cb) {
    try {
      const libros = await Libros.findById(req.params.id);
      if (!libros) {
        return cb(new Error('Libros no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Libros,${libros.editorial},${libros.encabezado}_${libros.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/libro');
      const matchingFiles = files.filter(f => f.startsWith(baseNombreArchivo));

      // Contar archivos coincidentes para determinar el próximo número
      const nextNumber = matchingFiles.length + 1;

      const nombreArchivo = `${baseNombreArchivo}_${nextNumber}${extension}`;
      cb(null, nombreArchivo);
    } catch (error) {
      cb(error);
    }
  }
});

const subidas = multer({ storage: almacenamiento });

router.get('/prueba-libros', LibrosControlador.pruebaLibros);
router.post("/registrar", LibrosControlador.registrarLibros);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], LibrosControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', LibrosControlador.borrarLibros);
router.put('/editar/:id', LibrosControlador.editarLibros);
router.get('/listar-temas', LibrosControlador.obtenerTemasLibros);
router.get('/tema/:id', LibrosControlador.listarPorTema);
router.get('/:id', LibrosControlador.obtenerLibrosPorID);
module.exports = router;
