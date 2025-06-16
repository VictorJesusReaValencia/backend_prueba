const express = require("express"); 
const router = express.Router();
const UserController = require("../controllers/userControlador")
const auth = require("../middleware/auth")
const stripeController = require('../controllers/stripeController');

router.get("/prueba-usuario", auth.auth, UserController.pruebaUser)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id",auth.auth, UserController.profile)
router.put("/actualizar-rol", auth.auth, UserController.actualizarRol);
router.put("/actualizar-a-gratis", auth.auth, UserController.regresarARolGratis);
router.post('/stripe/suscripcion', auth.auth, stripeController.crearSesionPago);
router.post('/stripe/suscripcion-prueba', auth.auth, stripeController.crearSesionDePrueba);

module.exports = router;