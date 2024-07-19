const express = require('express');
const multer = require('multer');
const path = require('path');
const Monumentos = require('../models/monumentos'); // Asegúrate de importar tu modelo Monumentos
const MonumentosControlador = require("../controllers/monumentosControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/monumentos");
  },
  filename: async function (req, file, cb) {
    try {
      const monumentos = await Monumentos.findById(req.params.id);
      if (!monumentos) {
        return cb(new Error('Monumentos no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Monumentos,${monumentos.tipo_monumento}_${monumentos.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/monumentos');
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

router.get('/prueba-monumentos', MonumentosControlador.pruebaMonumentos);
router.post("/registrar", MonumentosControlador.registrarMonumentos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], MonumentosControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', MonumentosControlador.borrarMonumentos);
router.put('/editar/:id', MonumentosControlador.editarMonumentos);
router.get('/listar-temas', MonumentosControlador.obtenerTemasMonumentos);
router.get('/tema/:id', MonumentosControlador.listarPorTema);
router.get('/icon/:id', MonumentosControlador.obtenerMonumentosPorID);

module.exports = router;
