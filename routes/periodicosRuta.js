const express = require('express');
const multer = require('multer');
const path = require('path');
const Periodicos = require('../models/periodicos'); // Asegúrate de importar tu modelo Periodicos
const PeriodicosControlador = require("../controllers/periodicosControlador");
const router = express.Router();
const fs = require('fs');

const memoryStorage = multer.memoryStorage();
const subidas = multer({ storage: memoryStorage }); // Ahora sube directo desde memoria

const upload = multer({ dest: 'imagenes/' });


router.get('/prueba-periodicos', PeriodicosControlador.pruebaPeriodicos);
router.post("/registrar", PeriodicosControlador.registrarPeriodicos);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], PeriodicosControlador.cargarFotografia); // Permite hasta 10 archivos
router.post('/editar-imagen/:id', [subidas.array("files", 10)], PeriodicosControlador.editarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', PeriodicosControlador.borrarPeriodicos);
router.put('/editar/:id', PeriodicosControlador.editarPeriodicos);
router.get('/id/:id', PeriodicosControlador.obtenerPeriodicosPorID);
router.get('/periodico/:id', PeriodicosControlador.obtenerPeriodicoPorNombre);
router.get("/listar", PeriodicosControlador.listarPeriodicos);

module.exports = router;