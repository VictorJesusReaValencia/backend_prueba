const express = require('express');
const multer = require('multer');
const path = require('path');
const Correspondencia = require('../models/correspondencia'); // Asegúrate de importar tu modelo Correspondencia
const CorrespondenciaControlador = require("../controllers/correspondenciaControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/correspondencia");
  },
  filename: async function (req, file, cb) {
    try {
      const correspondencia = await Correspondencia.findById(req.params.id);
      if (!correspondencia) {
        return cb(new Error('Correspondencia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Correspondencia,${correspondencia.asunto}_${correspondencia.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/correspondencia');
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
router.get('/prueba-correspondencia', CorrespondenciaControlador.pruebaCorrespondencia);
router.post("/registrar", CorrespondenciaControlador.registrarCorrespondencia);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], CorrespondenciaControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', CorrespondenciaControlador.borrarCorrespondencia);
router.put('/editar/:id', CorrespondenciaControlador.editarCorrespondencia);
router.get('/listar-temas', CorrespondenciaControlador.obtenerTemasCorrespondencia);
router.get('/tema/:id', CorrespondenciaControlador.listarPorTema);
router.get('/icon/:id', CorrespondenciaControlador.obtenerCorrespondenciaPorID);
router.get('/numero-por-pais/:id', CorrespondenciaControlador.obtenerNumeroDeFotosPorPais);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], CorrespondenciaControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/numero-institucion/:id', CorrespondenciaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', CorrespondenciaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', CorrespondenciaControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', CorrespondenciaControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', CorrespondenciaControlador.actualizarInstitucion);
router.get('/gpt/amado-nervo/:id', CorrespondenciaControlador.getChatGPTResponse);
router.post('/gpt/gpt/transcripcion', upload.single('file'), CorrespondenciaControlador.getTranscriptionFromImage);
router.post('/gpt/image-text/:id', upload.single('file'), CorrespondenciaControlador.processTextAndImage);
router.get('/search',CorrespondenciaControlador.getSugerencias)
router.get('/listar-pendientes', CorrespondenciaControlador.listarPendientes);

module.exports = router;
