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
const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-monumentos', MonumentosControlador.pruebaMonumentos);
router.post("/registrar", MonumentosControlador.registrarMonumentos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], MonumentosControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', MonumentosControlador.borrarMonumentos);
router.put('/editar/:id', MonumentosControlador.editarMonumentos);
router.get('/listar-temas', MonumentosControlador.obtenerTemasMonumentos);
router.get('/tema/:id', MonumentosControlador.listarPorTema);
router.get('/icon/:id', MonumentosControlador.obtenerMonumentosPorID);
router.get('/numero-por-pais/:id', MonumentosControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', MonumentosControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', MonumentosControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', MonumentosControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', MonumentosControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', MonumentosControlador.actualizarInstitucion);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], MonumentosControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/gpt/amado-nervo/:id', MonumentosControlador.getChatGPTResponse);
router.post('/gpt/gpt/transcripcion', upload.single('file'), MonumentosControlador.getTranscriptionFromImage);
router.post('/gpt/image-text/:id', upload.single('file'), MonumentosControlador.processTextAndImage);
router.get('/search',MonumentosControlador.getSugerencias)
router.get('/listar-pendientes', MonumentosControlador.listarPendientes);
module.exports = router;
