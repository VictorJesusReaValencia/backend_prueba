const hemerografia = require("../models/hemerografia")
const validator = require("validator")
const fs = require("fs")

const pruebaHemerografia = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarHemerografia = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new hemerografia(parametros)
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
    let hemerografiaId = req.params.id;

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

    try {
        const hemerografiaActualizada = await hemerografia.findOneAndUpdate(
            { _id: hemerografiaId },
            {
                $push: {
                    images: {
                        $each: archivos.map(file => ({
                            nombre: file.filename
                        }))
                    }
                }
            },
            { new: true }
        );

        if (!hemerografiaActualizada) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar la hemerografía"
            });
        } else {
            return res.status(200).json({
                status: "success",
                archivos: req.files
            });
        }
    } catch (error) {
        // Borrar todos los archivos en caso de error de actualización
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
const borrarHemerografia = async (req, res) => {
    const id = req.params.id;

    try {
        let hemero = await hemerografia.findOneAndDelete({ _id: id });

        if (!hemero) {
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
const editarHemerografia = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let hemero = await hemerografia.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                hemero
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerTemasHemerografia = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await hemerografia.aggregate([
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

        // Obtener una foto aleatoria por cada tema
        const temasConFoto = await Promise.all(temas.map(async tema => {
            const fotoAleatoria = await hemerografia.aggregate([
                { $match: { tema: tema.tema } },
                { $sample: { size: 1 } }
            ]);

            return {
                ...tema,
                fotoAleatoria: fotoAleatoria[0] ? fotoAleatoria[0].image : null // Asumiendo que la URL de la foto se encuentra en el campo 'url'
            };
        }));

        return res.status(200).json({
            status: "success",
            temas: temasConFoto
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
        let fotos = await hemerografia.find({ tema: tema }).sort({ numero_foto: 1 });

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
const obtenerHemerografiaPorID = async (req, res) => {
    let hemeroID = req.params.id;

    try {
        let hemero= await hemerografia.findById(hemeroID);

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                hemero
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la hemerografía"
        });
    }
};
module.exports={
    pruebaHemerografia,
    registrarHemerografia,
    cargarFotografia,
    borrarHemerografia,
    editarHemerografia,
    obtenerTemasHemerografia,
    listarPorTema,
    obtenerHemerografiaPorID
}

