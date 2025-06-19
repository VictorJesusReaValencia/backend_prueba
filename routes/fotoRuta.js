const express = require('express');
const multer = require('multer');
const path = require('path');
const Fotografia = require('../models/fotografia'); // Asegúrate de importar tu modelo Fotografia
const pruebaControlador = require("../controllers/fotoControlador")
const fs = require('fs');
const router = express.Router();

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria
const upload = multer({ dest: 'imagenes/' });

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/fotografias");
  },
  filename: async function (req, file, cb) {
    try {
      const fotogafias = await Fotografia.findById(req.params.id);
      if (!fotogafias) {
        return cb(new Error('Fotografia no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Fotografia,${fotogafias.tema}_${fotogafias.numero_foto}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/fotografias');
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

router.get('/prueba-foto', pruebaControlador.pruebaFoto);
router.get('/listar-foto', pruebaControlador.listar);
router.post("/registrar", pruebaControlador.registrarFoto);

router.post('/registrar-foto', pruebaControlador.registrarfoto2);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], pruebaControlador.registrarFotografia);
router.get('/foto/:id', pruebaControlador.obtenerFotoPorID);
router.get('/listar-paises', pruebaControlador.obtenerPaises);
router.get('/listar-temas', pruebaControlador.obtenerTemas);
router.get('/listar-albumes', pruebaControlador.obtenerAlbumes);
router.get('/album/:id', pruebaControlador.listarPorAlbum);
router.get('/tema/:id', pruebaControlador.listarPorTema);
router.delete('/borrar-foto/:id', pruebaControlador.borrarFoto);

router.put('/borrar-imagen/:id', pruebaControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', pruebaControlador.borrarPdfs);

router.put('/editar-foto/:id', pruebaControlador.editar);
router.get('/numero-por-pais/:id', pruebaControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', pruebaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', pruebaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', pruebaControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', pruebaControlador.obtenerNumeroDeBienesTotales);

router.put('/actualizar-institucion/:institucionanterior/:institucionueva', pruebaControlador.actualizarInstitucion);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], pruebaControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/search', pruebaControlador.getSugerencias)
router.get('/listar-pendientes', pruebaControlador.listarPendientes);

router.put('/editar/:id', pruebaControlador.editarFoto);

router.post('/editar-imagen/:id', [subidas.array("files", 10)], pruebaControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], pruebaControlador.editarPDFs); // Permite hasta 10 archivos

module.exports = router;
