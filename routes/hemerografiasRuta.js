const express = require('express');
const multer = require('multer');
const path = require('path');
const HemerografiaControlador = require("../controllers/hemerografiaControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria


router.get('/prueba', HemerografiaControlador.pruebaHemerografia);

router.post("/registrar", HemerografiaControlador.registrarHemerografia);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], HemerografiaControlador.registrarFotografia); // Permite hasta 10 archivos
router.post('/registrar-pdfs/:id', [subidas.array("pdfs", 10)], HemerografiaControlador.registrarPDF); // Permite hasta 10 archivos

router.delete('/borrar/:id', HemerografiaControlador.borrarHemerografia);
router.put('/borrar-imagen/:id', HemerografiaControlador.borrarFotografias);
router.put('/borrar-pdfs/:id', HemerografiaControlador.borrarPdfs);

router.put('/editar/:id', HemerografiaControlador.editarHemerografia);
router.post('/editar-imagen/:id', [subidas.array("files", 10)], HemerografiaControlador.editarFotografia); // Permite hasta 10 archivos
router.post('/editar-pdfs/:id', [subidas.array("pdfs", 10)], HemerografiaControlador.editarPDFs); // Permite hasta 10 archivos

router.get("/buscar", HemerografiaControlador.buscarHemerografia);

router.get('/listar-temas', HemerografiaControlador.obtenerTemasHemerografia);
router.get('/tema/:id', HemerografiaControlador.listarPorTema);
router.get('/hemero/:id', HemerografiaControlador.obtenerHemerografiaPorID);
router.get('/numero-bienes', HemerografiaControlador.obtenerNumeroDeBienesTotales);

router.get('/numero-por-pais/:id', HemerografiaControlador.obtenerNumeroDeFotosPorPais);
router.get('/numero-institucion/:id', HemerografiaControlador.obtenerNumeroDeFotosPorInstitucion);
router.get('/listar-temas-instituciones/:id', HemerografiaControlador.obtenerTemasInstituciones);
router.get('/:institucionId/:id', HemerografiaControlador.listarPorTemaEInstitucion);
router.get('/listar-carpetas', HemerografiaControlador.obtenerCarpetasRecortes);
router.get('/listar/carpeta/:id', HemerografiaControlador.listarPorCarpeta);

router.put('/actualizar-institucion/:institucionanterior/:institucionueva', HemerografiaControlador.actualizarInstitucion);
router.get('/listar-secciones', HemerografiaControlador.obtenerSeccionesRecortes);
router.get('/listar/seccion/:id', HemerografiaControlador.listarPorSeccion);

router.get('/search', HemerografiaControlador.getSugerencias)
router.get('/listar-pendientes', HemerografiaControlador.listarPendientes);

module.exports = router;