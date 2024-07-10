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

        let hemerografiaId = req.params.id;

        try {
            const hemerografiaActualizada = await hemerografia.findOneAndUpdate(
                { _id: hemerografiaId },
                { image: req.file.filename },
                { new: true }
            );

            if (!hemerografiaActualizada) {
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
module.exports={
    pruebaHemerografia,
    registrarHemerografia,
    cargarFotografia,
    borrarHemerografia,
    editarHemerografia,
    obtenerTemasHemerografia,
    listarPorTema
}

