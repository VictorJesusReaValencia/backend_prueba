const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a la base de datos Amado Nervo");
    } catch (error) {
        console.log(error);
        process.exit(1); // Salir del proceso con un error
    }
};

module.exports = {
    connection
};
