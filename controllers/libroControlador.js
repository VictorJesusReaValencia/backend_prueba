const libro = require("../models/libros")
const validator = require("validator")
const fs = require("fs")

const pruebaLibro = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarLibro = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new libro(parametros)
        const publicacionGuardada = await publicacion.save()
        return res.status(200).json({
            status : "successs",
            mensaje: "Libros guardada correctamente",
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
const cargarFotografia= async (req,res) =>{
    console.log(req.file)
    let archivo = req.file.originalname;
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1]
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif" && extension != "JPG"){
        fs.unlink(req.file.path,(error)=>{
            return res.status(500).json({
                status:"error",
                message:"nelprro3",
                extension
            })
        })

    }else{

        let libroId = req.params.id;

        try {
            const libroActualizada = await libro.findOneAndUpdate(
                { _id: libroId },
                { image: req.file.filename },
                { new: true }
            );

            if (!libroActualizada) {
                return res.status(500).json({
                    status: "error",
                    message: "nelprro2"
                });
            } else {
                return res.status(200).json({
                    status: "simon",
                    fichero: req.file
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "nelprro"
            });
        }

    }

} 
const borrarLibro = async (req, res) => {
    const id = req.params.id;

    try {
        let hemero = await libro.findOneAndDelete({ _id: id });

        if (!hemero) {
            return res.status(404).json({
                status: "error",
                message: "Libros no encontrada",
                id
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Libros borrada exitosamente"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar la Libros"
        });
    }
};
const editarLibro = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let hemero = await libro.findByIdAndUpdate(id, datosActualizados, { new: true });

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
const obtenerTemasLibro = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await libro.aggregate([
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
            const fotoAleatoria = await libro.aggregate([
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
        let fotos = await libro.find({ tema: tema }).sort({ numero_foto: 1 });

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
const obtenerLibroPorID = async (req, res) => {
    let iconID = req.params.id;

    try {
        let icon= await libro.findById(iconID);

        if (!icon) {
            return res.status(404).json({
                status: "error",
                message: "Libros no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                icon
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la Libros"
        });
    }
};
module.exports={
    pruebaLibro,
    registrarLibro,
    cargarFotografia,
    borrarLibro,
    editarLibro,
    obtenerTemasLibro,
    listarPorTema,
    obtenerLibroPorID
}

