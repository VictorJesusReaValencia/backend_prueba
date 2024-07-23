const objetos = require("../models/objetos")
const validator = require("validator")
const fs = require("fs")

const pruebaObjetos = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarObjetos = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new objetos(parametros)
        const publicacionGuardada = await publicacion.save()
        return res.status(200).json({
            status : "successs",
            mensaje: "publicacion periodica guardada correctamente",
            publicacionGuardada
        })

    }catch(erro){
        return res.status(400).json({
            status : "error",
            mensaje: "Algo anda mal we",
            parametros
        })
    }
}

const cargarFotografia = async (req, res) => {
    console.log(req.files); // Para verificar que se están recibiendo múltiples archivos
    let archivos = req.files;

    // Validar extensiones de archivos
    for (let archivo of archivos) {
        let archivo_split = archivo.originalname.split(".");
        let extension = archivo_split[archivo_split.length - 1].toLowerCase();
        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
            fs.unlink(archivo.path, (error) => {
                // Borrar todos los archivos en caso de error de validación
                for (let file of archivos) {
                    fs.unlink(file.path, () => {});
                }
                return res.status(500).json({
                    status: "error",
                    message: "Extensión de archivo no permitida",
                    extension
                });
            });
            return;
        }
    }

    // Si todas las extensiones son válidas, guardar los archivos y responder con éxito
    try {
        // Aquí puedes agregar lógica adicional para procesar las imágenes si es necesario

        return res.status(200).json({
            status: "success",
            archivos: req.files
        });
    } catch (error) {
        // Borrar todos los archivos en caso de error
        for (let file of archivos) {
            fs.unlink(file.path, () => {});
        }
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error
        });
    }
};

const borrarObjetos = async (req, res) => {
    const id = req.params.id;

    try {
        let obj = await objetos.findOneAndDelete({ _id: id });

        if (!obj) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada",
                id
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Hemerografía borrada exitosamente"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar la Hemerografía"
        });
    }
};
const editarObjetos = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let obj = await objetos.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!obj) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                obj
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerTemasObjetos = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await objetos.aggregate([
            {
                $group: {
                    _id: "$tema",
                    numeroDeFotos: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    tema: "$_id",
                    numeroDeFotos: 1
                }
            }
        ]);

        if (!temas.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron temas"
            });
        }

        // Obtener una foto aleatoria por cada tema y el valor del primer elemento en el campo nombre
        const temasConFotoYNombre = await Promise.all(temas.map(async tema => {
            const libroAleatorio = await objetos.aggregate([
                { $match: { tema: tema.tema } },
                { $sample: { size: 1 } }
            ]);

            const nombreImagen = libroAleatorio[0]?.images?.length > 0 ? libroAleatorio[0].images[0].nombre : null;

            return {
                ...tema,
                fotoAleatoria: libroAleatorio[0] ? libroAleatorio[0].image : null, // Asumiendo que la URL de la foto se encuentra en el campo 'image'
                nombreImagen: nombreImagen
            };
        }));

        return res.status(200).json({
            status: "success",
            temas: temasConFotoYNombre
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los temas"
        });
    }
};
const listarPorTema = async (req, res) => {
    const tema = req.params.id;
    try {
        let fotos = await objetos.find({ tema: tema }).sort({ numero_foto: 1 });

        if (!fotos || fotos.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotos para este tema"
            });
        } else {
            return res.status(200).send({
                status: "success",
                fotos
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las fotos"
        });
    }
};
const obtenerObjetosPorID = async (req, res) => {
    let hemeroID = req.params.id;

    try {
        let obj= await objetos.findById(hemeroID);

        if (!obj) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                obj
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la hemerografía"
        });
    }
};

const obtenerNumeroDeFotosPorPais = async (req, res) => {
    let paisID = req.params.id;
  
    try {
      // Suponiendo que objetos es tu modelo de Mongoose
      let fotosCount = await objetos.countDocuments({ pais: paisID });
  
      return res.status(200).json({
        status: "success",
        count: fotosCount
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener el número de fotos"
      });
    }
  };
const obtenerNumeroDeFotosPorInstitucion = async (req, res) => {
let paisID = req.params.id;

try {
    // Suponiendo que objetos es tu modelo de Mongoose
    let fotosCount = await objetos.countDocuments({ institucion: paisID });

    return res.status(200).json({
    status: "success",
    count: fotosCount
    });
} catch (error) {
    return res.status(500).json({
    status: "error",
    message: "Error al obtener el número de fotos"
    });
}
};
const obtenerTemasInstituciones = async (req, res) => {
        try {
            const institucionId  = req.params.id;
    
            console.log('Institucion ID:', institucionId);
    
            // Obtener temas y número de fotos por tema filtrando por institución
            const temas = await objetos.aggregate([
                {
                    $match: {
                        institucion: institucionId
                    }
                },
                {
                    $group: {
                        _id: "$tema",
                        numeroDeFotos: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        tema: "$_id",
                        numeroDeFotos: 1
                    }
                }
            ]);
    
            console.log('Temas encontrados:', temas);
    
            if (!temas.length) {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontraron temas"
                });
            }
    
            // Obtener una foto aleatoria por cada tema
            const temasConFoto = await Promise.all(temas.map(async tema => {
                const fotoAleatoria = await objetos.aggregate([
                    { $match: { tema: tema.tema, institucion: institucionId } },
                    { $sample: { size: 1 } }
                ]);
    
                return {
                    ...tema,
                    fotoAleatoria: fotoAleatoria[0] ? fotoAleatoria[0].image : null // Asumiendo que la URL de la foto se encuentra en el campo 'url'
                };
            }));
    
            console.log('Temas con foto:', temasConFoto);
    
            return res.status(200).json({
                status: "success",
                temas: temasConFoto
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({
                status: "error",
                message: "Error al obtener los temas"
            });
        }
    };
    
module.exports={
    pruebaObjetos,
    registrarObjetos,
    cargarFotografia,
    borrarObjetos,
    editarObjetos,
    obtenerTemasObjetos,
    listarPorTema,
    obtenerObjetosPorID,
    obtenerNumeroDeFotosPorPais,
    obtenerNumeroDeFotosPorInstitucion,
    obtenerTemasInstituciones
}

