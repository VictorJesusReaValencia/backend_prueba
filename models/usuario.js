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
     enum: ["admin", "gratis", "premium"],
     default: "gratis",
     required: true}
    ,
    password: {
      type: String,
      required:true
    },
    image: {
        type: String,
        default:"default.jpg"
    },
    fechaSubscripcion: { type: Date },
metodoPago: { type: String }

  });


module.exports = model("Usuario",UsuarioSchema,"usuarios");