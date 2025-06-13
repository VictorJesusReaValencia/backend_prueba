const express = require('express');
const multer = require('multer');
const path = require('path');
const Hemerografia = require('../models/hemerografia'); // Asegúrate de importar tu modelo Hemerografia
const HemerografiaControlador = require("../controllers/hemerografiaControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

const upload = multer({ dest: 'imagenes/' });


 

router.get('/prueba-hemerografia', HemerografiaControlador.pruebaHemerografia);
router.post("/registrar", HemerografiaControlador.registrarHemerografia);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], HemerografiaControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', HemerografiaControlador.borrarHemerografia);

router.put('/editar/:id', HemerografiaControlador.editarHemerografia);
router.post('/editar-imagen/:id', [subidas.array("files", 10)], HemerografiaControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], HemerografiaControlador.editarPDFs); // Permite hasta 10 archivos


router.get('/listar-temas', HemerografiaControlador.obtenerTemasHemerografia);
router.get('/tema/:id', HemerografiaControlador.listarPorTema);
router.get('/hemero/:id', HemerografiaControlador.obtenerHemerografiaPorID);
router.get('/numero-por-pais/:id', HemerografiaControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', HemerografiaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', HemerografiaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', HemerografiaControlador.listarPorTemaEInstitucion);
router.get('/listar-carpetas', HemerografiaControlador.obtenerCarpetasRecortes);
router.get('/listar/carpeta/:id', HemerografiaControlador.listarPorCarpeta);
router.get('/numero-bienes', HemerografiaControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', HemerografiaControlador.actualizarInstitucion);
router.get('/listar-secciones', HemerografiaControlador.obtenerSeccionesRecortes);
router.get('/listar/seccion/:id', HemerografiaControlador.listarPorSeccion);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], HemerografiaControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/gpt/amado-nervo/:id', HemerografiaControlador.getChatGPTResponse);
router.post('/gpt/gpt/transcripcion', upload.single('file'), HemerografiaControlador.getTranscriptionFromImage);
router.post('/gpt/image-text/:id', upload.single('file'), HemerografiaControlador.processTextAndImage);
router.get('/search',HemerografiaControlador.getSugerencias)
router.get('/listar-pendientes', HemerografiaControlador.listarPendientes);

module.exports = router;
