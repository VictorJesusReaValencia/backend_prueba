const jwt = require('jwt-simple');
const moment = require('moment');

// Importar clave secreta
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

// Función de autenticación
exports.auth = (req, res, next) => {
    // Comprobar si me llega la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        });
    }
    
    // Decodificar el token
    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        const payload = jwt.decode(token, secret);

        // Comprobar la expiración del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "El token ha expirado"
            });
        }

        // Adjuntar usuario identificado a la request
        req.user = payload;

    } catch (ex) {
        return res.status(404).send({
            status: "error",
            message: "El token no es válido",
            error
        });
    }

    // Pasar al siguiente middleware
    next();
};
