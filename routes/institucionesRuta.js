const express = require('express');
const multer = require('multer');
const path = require('path');
const Instituciones = require('../models/instituciones'); // Asegúrate de importar tu modelo Instituciones
const InstitucionesControlador = require("../controllers/institucionesControlador");
const router = express.Router();
const fs = require('fs');

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./imagenes/instituciones");
  },
  filename: async function (req, file, cb) {
    try {
      const instituciones = await Instituciones.findById(req.params.id);
      if (!instituciones) {
        return cb(new Error('Instituciones no encontrada'));
      }
      const extension = path.extname(file.originalname);
      const baseNombreArchivo = `Instituciones,${instituciones.nombre}_${instituciones.numero_registro}`;

      // Obtener el conteo de archivos existentes en la carpeta
      const files = fs.readdirSync('./imagenes/instituciones');
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

router.get('/prueba-instituciones', InstitucionesControlador.pruebaInstituciones);
router.post("/registrar", InstitucionesControlador.registrarInstituciones);
router.post('/registrar-imagen/:id', [subidas.array("files", 10)], InstitucionesControlador.cargarFotografia); // Permite hasta 10 archivos
router.delete('/borrar/:id', InstitucionesControlador.borrarInstituciones);
router.put('/editar/:id', InstitucionesControlador.editarInstituciones);
router.get('/listar-temas', InstitucionesControlador.obtenerTemasInstituciones);
router.get('/tema/:id', InstitucionesControlador.listarPorTema);
router.get('/pais/:id', InstitucionesControlador.listarPorPais);
router.get('/:id', InstitucionesControlador.obtenerInstitucionesPorNombre);
router.get('/listar/todo', InstitucionesControlador.listarTodo);


module.exports = router;
