const express = require('express');
const multer = require('multer');
const path = require('path');
const Periodicos = require('../models/periodicos'); // Asegúrate de importar tu modelo Periodicos
const PeriodicosControlador = require("../controllers/periodicosControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/periodicos");
  },
  filename: async function (req, file, cb) {
    try {
      const periodicos = await Periodicos.findById(req.params.id);
      if (!periodicos) {
        return cb(new Error('Periodicos no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Periodicos,${periodicos.nombre_periodico},${periodicos.encabezado}_${periodicos.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/periodicos');
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

router.get('/prueba-periodicos', PeriodicosControlador.pruebaPeriodicos);
router.post("/registrar", PeriodicosControlador.registrarPeriodicos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], PeriodicosControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', PeriodicosControlador.borrarPeriodicos);
router.put('/editar/:id', PeriodicosControlador.editarPeriodicos);
router.get('/id/:id', PeriodicosControlador.obtenerPeriodicosPorID);
router.get('/periodico/:id', PeriodicosControlador.obtenerPeriodicoPorNombre);

module.exports = router;