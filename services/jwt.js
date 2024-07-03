const jwt = require("jwt-simple")
const moment = require("moment")

const secret = "CLAVE_SECRETA_del_proyecto_DE_LA_RED_soCIAL_987987";

// Crear una función para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    // Devolver JWT token codificado
    return jwt.encode(payload,secret);
};


module.exports = {
    secret,
    createToken
}