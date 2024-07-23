const express = require('express');
const multer = require('multer');
const path = require('path');
const Iconografia = require('../models/iconografia'); // Asegúrate de importar tu modelo Iconografia
const IconografiaControlador = require("../controllers/iconografiaControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/iconografia");
  },
  filename: async function (req, file, cb) {
    try {
      const iconografia = await Iconografia.findById(req.params.id);
      if (!iconografia) {
        return cb(new Error('Iconografia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Iconografia,${iconografia.nombre_periodico},${iconografia.encabezado}_${iconografia.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/iconografia');
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

router.get('/prueba-iconografia', IconografiaControlador.pruebaIconografia);
router.post("/registrar", IconografiaControlador.registrarIconografia);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], IconografiaControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', IconografiaControlador.borrarIconografia);
router.put('/editar/:id', IconografiaControlador.editarIconografia);
router.get('/listar-temas', IconografiaControlador.obtenerTemasIconografia);
router.get('/tema/:id', IconografiaControlador.listarPorTema);
router.get('/icon/:id', IconografiaControlador.obtenerIconografiaPorID);
router.get('/numero-por-pais/:id', IconografiaControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', IconografiaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', IconografiaControlador.obtenerTemasInstituciones);

module.exports = router;
