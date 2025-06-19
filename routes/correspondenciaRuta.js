const express = require('express');
const multer = require('multer');
const path = require('path');
const Correspondencia = require('../models/correspondencia'); // Asegúrate de importar tu modelo Correspondencia
const CorrespondenciaControlador = require("../controllers/correspondenciaControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-correspondencia', CorrespondenciaControlador.pruebaCorrespondencia);
router.post("/registrar", CorrespondenciaControlador.registrarCorrespondencia);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], CorrespondenciaControlador.registrarFotografia);
// Permite hasta 10 archivos
router.delete('/borrar/:id', CorrespondenciaControlador.borrarCorrespondencia);
router.put('/borrar-imagen/:id', CorrespondenciaControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', CorrespondenciaControlador.borrarPdfs);

router.put('/editar/:id', CorrespondenciaControlador.editarCorrespondencia);
router.post('/editar-imagen/:id', [subidas.array("files", 10)], CorrespondenciaControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], CorrespondenciaControlador.editarPDFs);
router.get("/buscar", CorrespondenciaControlador.buscarCorrespondencia);

router.get('/listar-temas', CorrespondenciaControlador.obtenerTemasCorrespondencia);
router.get('/tema/:id', CorrespondenciaControlador.listarPorTema);
router.get('/icon/:id', CorrespondenciaControlador.obtenerCorrespondenciaPorID);
router.get('/numero-por-pais/:id', CorrespondenciaControlador.obtenerNumeroDeFotosPorPais);
//router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], CorrespondenciaControlador.guardarPDF); // Permite hasta 10 archivos
router.get('/numero-institucion/:id', CorrespondenciaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', CorrespondenciaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', CorrespondenciaControlador.listarPorTemaEInstitucion);
router.get('/numero-bienes', CorrespondenciaControlador.obtenerNumeroDeBienesTotales);
router.put('/actualizar-institucion/:institucionanterior/:institucionueva', CorrespondenciaControlador.actualizarInstitucion);
router.get('/search', CorrespondenciaControlador.getSugerencias)
router.get('/listar-pendientes', CorrespondenciaControlador.listarPendientes);
router.post('/registrar-pdf/:id', [subidas.array("pdfs", 10)], CorrespondenciaControlador.registrarPDF); // Permite hasta 10 archivos
router.get('/search', CorrespondenciaControlador.getSugerencias)
router.get('/listar-pendientes', CorrespondenciaControlador.listarPendientes);
module.exports = router;
