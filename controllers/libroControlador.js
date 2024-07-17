const libros = require("../models/libros")
const validator = require("validator")
const fs = require("fs")
const path = require('path');

const pruebaLibros = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarLibros = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new libros(parametros)
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
    let librosId = req.params.id;

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
        const librosActualizada = await libros.findOneAndUpdate(
            { _id: librosId },
            {
                $set: {
                    images: archivos.map(file => ({
                        nombre: file.filename
                    }))
                }
            },
            { new: true }
        );

        if (!librosActualizada) {
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
const borrarLibros = async (req, res) => {
    const id = req.params.id;

    try {
        let libro = await libros.findOneAndDelete({ _id: id });

        if (!libro) {
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
const editarLibros = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let libro = await libros.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                libro
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerTemasLibros = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await libros.aggregate([
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
            const libroAleatorio = await libros.aggregate([
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
        let fotos = await libros.find({ tema: tema }).sort({ numero_foto: 1 });

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
const obtenerLibrosPorID = async (req, res) => {
    let hemeroID = req.params.id;

    try {
        let libro= await libros.findById(hemeroID);

        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                libro
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la hemerografía"
        });
    }
};
const guardarPDF = async (req, res) => {
    console.log(req.files); // Para verificar que se están recibiendo múltiples archivos
    let archivos = req.files;
    let librosId = req.params.id;

    try {
        // Obtener título desde la base de datos
        const libro = await libros.findById(librosId);
        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Libro no encontrado"
            });
        }
        let titulo = libro.titulo; // Asumiendo que el título está en el campo 'titulo' del documento

        // Validar extensiones de archivos
        for (let archivo of archivos) {
            let archivo_split = archivo.originalname.split(".");
            let extension = archivo_split[archivo_split.length - 1].toLowerCase();
            if (extension !== "pdf") {
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

        // Renombrar y mover archivos
        for (let archivo of archivos) {
            let nuevoNombre = `${titulo}_${numero_registro}.${archivo.originalname.split('.').pop()}`;
            let nuevaRuta = path.join(__dirname, '../imagenes/libros/pdf', nuevoNombre);

            fs.renameSync(archivo.path, nuevaRuta);
            archivo.filename = nuevoNombre;
        }

        const librosActualizada = await libros.findOneAndUpdate(
            { _id: librosId },
            {
                $set: {
                    pdfs: archivos.map(file => ({
                        nombre: file.filename
                    }))
                }
            },
            { new: true }
        );

        if (!librosActualizada) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar la hemerografía"
            });
        } else {
            return res.status(200).json({
                status: "success",
                archivos: archivos.map(file => ({ nombre: file.filename }))
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

module.exports={
    pruebaLibros,
    registrarLibros,
    cargarFotografia,
    borrarLibros,
    editarLibros,
    obtenerTemasLibros,
    listarPorTema,
    obtenerLibrosPorID,
    guardarPDF
}

