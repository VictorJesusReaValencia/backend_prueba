const express = require('express');
const multer = require('multer');
const path = require('path');
const Instituciones = require('../models/instituciones'); // Asegúrate de importar tu modelo Instituciones
const InstitucionesControlador = require("../controllers/institucionesControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

const upload = multer({ dest: 'imagenes/' });

router.get('/prueba-instituciones', InstitucionesControlador.pruebaInstituciones);
router.post("/registrar", InstitucionesControlador.registrarInstituciones);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], InstitucionesControlador.cargarFotografia); // Permite hasta 10 archivos
router.post('/editar-imagen/:id', [subidas.array("files", 10)], InstitucionesControlador.editarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', InstitucionesControlador.borrarInstituciones);
router.put('/editar/:id', InstitucionesControlador.editarInstituciones);
router.get('/listar-temas', InstitucionesControlador.obtenerTemasInstituciones);
router.get('/tema/:id', InstitucionesControlador.listarPorTema);
router.get('/pais/:id', InstitucionesControlador.listarPorPais);
router.get('/:id', InstitucionesControlador.obtenerInstitucionesPorNombre);
router.get('/listar/todo', InstitucionesControlador.listarTodo);


module.exports = router;
