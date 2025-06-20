const express = require('express');
const multer = require('multer');
const path = require('path');
const Libros = require('../models/libros'); // Asegúrate de importar tu modelo Libros
const LibrosControlador = require("../controllers/libroControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();


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
      const baseNombreArchivo = `Libros_${libros.numero_registro}`;

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

const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria
const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-libros', LibrosControlador.pruebaLibros);
router.post("/registrar", LibrosControlador.registrarLibros);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], LibrosControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', LibrosControlador.borrarLibro);
router.put('/editar/:id', LibrosControlador.editarLibros);
router.get('/listar-temas', LibrosControlador.obtenerTemasLibros);
router.get('/tema/:id', LibrosControlador.listarPorTema);
router.get('/libro/:id', LibrosControlador.obtenerLibrosPorID);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], LibrosControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/numero-por-pais/:id', LibrosControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', LibrosControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', LibrosControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', LibrosControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', LibrosControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', LibrosControlador.actualizarInstitucion);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], LibrosControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/gpt/amado-nervo/:id', LibrosControlador.getChatGPTResponse);
router.post('/gpt/gpt/transcripcion', upload.single('file'), LibrosControlador.getTranscriptionFromImage);
router.post('/gpt/image-text/:id', upload.single('file'), LibrosControlador.processTextAndImage);
router.get('/search',LibrosControlador.getSugerencias)
router.get('/listar-pendientes', LibrosControlador.listarPendientes);

router.post('/editar-imagen/:id', [subidas.array("files", 10)], LibrosControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], LibrosControlador.editarPDFs); // Permite hasta 10 archivos



module.exports = router;
