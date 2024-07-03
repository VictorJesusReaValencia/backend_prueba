const express = require("express"); 
const router = express.Router();
const UserController = require("../controllers/userControlador")
const auth = require("../middleware/auth")


router.get("/prueba-usuario", auth.auth, UserController.pruebaUser)
router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/profile/:id",auth.auth, UserController.profile)



module.exports = router;