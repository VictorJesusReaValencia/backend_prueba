const express = require('express');
const multer = require('multer');
const path = require('path');
const Documentacion = require('../models/documentacion'); // Asegúrate de importar tu modelo Documentacion
const DocumentacionControlador = require("../controllers/documentacionControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/documentacion");
  },
  filename: async function (req, file, cb) {
    try {
      const documentacion = await Documentacion.findById(req.params.id);
      if (!documentacion) {
        return cb(new Error('Documentacion no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Documentacion,${documentacion.institucion}_${documentacion.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/documentacion');
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

router.get('/prueba-documentacion', DocumentacionControlador.pruebaDocumentacion);
router.post("/registrar", DocumentacionControlador.registrarDocumentacion);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], DocumentacionControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', DocumentacionControlador.borrarDocumentacion);
router.put('/editar/:id', DocumentacionControlador.editarDocumentacion);
router.get('/listar-temas', DocumentacionControlador.obtenerTemasDocumentacion);
router.get('/tema/:id', DocumentacionControlador.listarPorTema);
router.get('/docu/:id', DocumentacionControlador.obtenerDocumentacionPorID);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], DocumentacionControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/numero-por-pais/:id', DocumentacionControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', DocumentacionControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', DocumentacionControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', DocumentacionControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', DocumentacionControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', DocumentacionControlador.actualizarInstitucion);
router.get('/gpt/amado-nervo/:id', DocumentacionControlador.getChatGPTResponse);
router.post('/gpt/gpt/transcripcion', upload.single('file'), DocumentacionControlador.getTranscriptionFromImage);
router.post('/gpt/image-text/:id', upload.single('file'), DocumentacionControlador.processTextAndImage);
router.get('/search',DocumentacionControlador.getSugerencias)
router.get('/listar-pendientes', DocumentacionControlador.listarPendientes);

module.exports = router;
