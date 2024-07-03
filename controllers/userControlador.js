const User = require("../models/usuario");
const jwt = require("../services/jwt")
const bcrypt = require("bcrypt")


// Acciones de prueba
const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

// Registro de usuarios
const register = async (req, res) => {
    try {
        // Recojer datos de petición
        let params = req.body;

        // Validación
        if (!params.nombre || !params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar",
                params
            });
        }

        // Control de usuarios repetidos
        const existingUser = await User.findOne({ email: params.email.toLowerCase() });
        if (existingUser) {
            return res.status(200).json({
                status: "success",
                message: "El usuario ya existe",
                params
            });
        }

        // Cifrar
        const pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;
        params.email = params.email.toLowerCase();

        // Crear objeto del usuario
        let user_to_save = new User(params);

        // Guardar usuario
        const userStored = await user_to_save.save();
        if (!userStored) {
            return res.status(500).send({
                status: "error",
                message: "Error al guardar el usuario"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario registrado",
            user: userStored
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }
};


const login = async (req, res) => {
    try {
        // Recoger datos
        let params = req.body;

        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar",
                params
            });
        }

        // Buscar en la base de datos
        const user = await User.findOne({ email: params.email.toLowerCase() });

        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Error al encontrar usuario en la base de datos",
                params
            });
        }

        // Comprobar contraseña
        const pwd = bcrypt.compareSync(params.password, user.password);

        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "No te has identificado correctamente"
            });
        }

        // Devolver token
        const token = jwt.createToken(user);


        // Excluir la contraseña del usuario antes de devolver la respuesta
        user.password = undefined;

        return res.status(200).send({
            status: "success",
            message: "Acción de login",
            user,
            token
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }
};

const profile = async (req, res) => {
    try {
        // Recibir datos
        const id = req.params.id;

        // Consultar
        const userProfile = await User.findById(id).select('-password');

        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "Error al encontrar usuario"
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Acción de profile",
            user: userProfile
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al encontrar usuario",
            error: error.message
        });
    }
};

// Exportar acciones
module.exports = {
    pruebaUser,
    register,
    login,
    profile
}
