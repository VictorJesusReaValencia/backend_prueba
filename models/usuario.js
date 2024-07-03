const { Schema, model} = require("mongoose")
const UsuarioSchema = new Schema({
    nombre: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      required:true,
    },
    role: {
      type: String,
      default:"role_user",
      required: true
    },
    password: {
      type: String,
      required:true
    },
    image: {
        type: String,
        default:"default.jpg"
    }
  });


module.exports = model("Usuario",UsuarioSchema,"usuarios");