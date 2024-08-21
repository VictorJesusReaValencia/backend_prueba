const correspondencia = require("../models/correspondencia")
const validator = require("validator")
const fs = require("fs")
const path = require('path');

const pruebaCorrespondencia = (req, res) => {
    return res.status(200).send({
        message: "Mensaje de prueba enviado"
    });
}
const registrarCorrespondencia = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;

    try{
        const publicacion = new correspondencia(parametros)
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
const borrarCorrespondencia = async (req, res) => {
    const id = req.params.id;

    try {
        let Corresp = await correspondencia.findOneAndDelete({ _id: id });

        if (!Corresp) {
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
const editarCorrespondencia = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let Corresp = await correspondencia.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!Corresp) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                Corresp
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerTemasCorrespondencia = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await correspondencia.aggregate([
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
            const libroAleatorio = await correspondencia.aggregate([
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
        let fotos = await correspondencia.find({ tema: tema }).sort({ numero_foto: 1 });

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
const obtenerCorrespondenciaPorID = async (req, res) => {
    let hemeroID = req.params.id;

    try {
        let Corresp= await correspondencia.findById(hemeroID);

        if (!Corresp) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                Corresp
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
    let correspondenciaId = req.params.id;

    try {
        // Obtener título desde la base de datos
        const libro = await correspondencia.findById(correspondenciaId);
        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Libro no encontrado"
            });
        }
        let titulo = libro.titulo; // Asumiendo que el título está en el campo 'titulo' del documento

        console.log("se encuentra el libro")
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
        console.log("se valida pdf")

        // Renombrar y mover archivos
        for (let archivo of archivos) {
            
            let nuevoNombre = `Correspondencia,${titulo}_${libro.numero_registro}_1.${archivo.originalname.split('.').pop()}`;
            let nuevaRuta = path.join(__dirname, '../imagenes/correspondencia/pdf', nuevoNombre);
            fs.renameSync(archivo.path, nuevaRuta);
            archivo.filename = nuevoNombre;
        }
        console.log("se renombra y ruta")
        const correspondenciaActualizada = await correspondencia.findOneAndUpdate(
            { _id: correspondenciaId },
            {
                $set: {
                    pdfs: archivos.map(file => ({
                        nombre: file.filename
                    }))
                }
            },
            { new: true }
        );

        if (!correspondenciaActualizada) {
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
const obtenerNumeroDeFotosPorPais = async (req, res) => {
    let paisID = req.params.id;
  
    try {
      // Suponiendo que correspondencia es tu modelo de Mongoose
      let fotosCount = await correspondencia.countDocuments({ pais: paisID });
  
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
    // Suponiendo que correspondencia es tu modelo de Mongoose
    let fotosCount = await correspondencia.countDocuments({ institucion: paisID });

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
        const institucionId = req.params.id;

        console.log('Institucion ID:', institucionId);

        // Obtener temas y número de fotos por tema filtrando por institución
        const temas = await correspondencia.aggregate([
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

        // Obtener una foto aleatoria por cada tema y el valor del primer elemento en el campo nombre
        const temasConFotoYNombre = await Promise.all(temas.map(async tema => {
            const fotoAleatoria = await correspondencia.aggregate([
                { $match: { tema: tema.tema, institucion: institucionId } },
                { $sample: { size: 1 } }
            ]);

            const nombreImagen = fotoAleatoria[0]?.images?.length > 0 ? fotoAleatoria[0].images[0].nombre : null;

            return {
                ...tema,
                fotoAleatoria: fotoAleatoria[0] ? fotoAleatoria[0].image : null, // Asumiendo que la URL de la foto se encuentra en el campo 'image'
                nombreImagen: nombreImagen
            };
        }));

        console.log('Temas con foto y nombre:', temasConFotoYNombre);

        return res.status(200).json({
            status: "success",
            temas: temasConFotoYNombre
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los temas"
        });
    }
};
const listarPorTemaEInstitucion = async (req, res) => {
    const { institucionId, id: tema } = req.params;
    console.log(institucionId)
    console.log(tema)
    try {
        let fotos = await correspondencia.find({ tema: tema, institucion: institucionId }).sort({ numero_foto: 1 });

        if (!fotos || fotos.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotos para este tema e institución"
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
const obtenerNumeroDeBienesTotales = async (req, res) => {
    try {
      // Suponiendo que Bienes es tu modelo de Mongoose
      let bienesCount = await correspondencia.countDocuments({});
  
      return res.status(200).json({
        status: "success",
        count: bienesCount
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error al obtener el número de bienes"
      });
    }
  };
const actualizarInstitucion = async (req, res) => {
    const { institucionanterior, institucionueva } = req.params;

    try {
        // Buscar todas las fotos que tengan la institución anterior
        let fotosActualizadas = await correspondencia.updateMany(
            { institucion: institucionanterior },
            { $set: { institucion: institucionueva } },
            { new: true }
        );

        if (fotosActualizadas.nModified === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotografías con la institución especificada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Institución actualizada en las fotografías exitosamente",
                fotosActualizadas
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la institución en las fotografías",
            error: error.message
        });
    }
};
const getChatGPTResponse = async (req,res) => {

    const texto = req.params.id
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: texto }],
        });
        console.log(response.choices[0].message.content)
        return res.status(200).json({
            status: "success",
            message: response.choices[0].message.content,
            
        });
    } catch (error) {
        console.error('Error al hacer la solicitud a la API:', error.message);
        return 'No se pudo obtener una respuesta de ChatGPT.';
    }
};

const getTranscriptionFromImage = async (req, res) => {
    try {
        // Asegurarse de que se haya enviado un archivo
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se ha enviado ninguna imagen."
            });
        }

        // Obtener la ruta temporal de la imagen subida
        const imagePath = req.file.path;

        // Leer la imagen y convertirla a base64
        const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

        // Realizar la solicitud a la API de OpenAI utilizando la librería oficial
        const response = await  openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Dame la transcripcion de esta imagen, solo contesta con el texto de la transcripcion"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageData}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        // Mostrar la respuesta en la consola
        console.log(response.choices[0].message);

        return res.status(200).json({
            status: "success",
            transcription: response.choices[0].message.content,
        });
    } catch (error) {
        console.error('Error al hacer la solicitud a la API:', error.message);
        return res.status(500).json({
            status: "error",
            message: 'No se pudo obtener una transcripción de la imagen.',
            error: error
        });
    }
};
const processTextAndImage = async (req, res) => {
    const texto = req.params.id;
    
    try {
        // Asegurarse de que se haya enviado un archivo de imagen
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se ha enviado ninguna imagen."
            });
        }

        // Obtener la ruta temporal de la imagen subida
        const imagePath = req.file.path;

        // Leer la imagen y convertirla a base64
        const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

        // Realizar la solicitud a la API de OpenAI utilizando la librería oficial
        const response = await  openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: texto
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageData}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        // Mostrar la respuesta en la consola
        console.log(response.choices[0].message.content);

        return res.status(200).json({
            status: "success",
            message: response.choices[0].message.content,
        });
    } catch (error) {
        console.error('Error al hacer la solicitud a la API:', error.message);
        return res.status(500).json({
            status: "error",
            message: 'No se pudo obtener una respuesta de ChatGPT.',
            error: error
        });
    }
};


const getSugerencias = async (req, res) => {
    try {
        const { query, campo } = req.query; // Obtener la query y el campo de la solicitud
        if (!query || !campo) {
            return res.status(400).json({ error: 'Se requieren un término de búsqueda y un campo válido' });
        }

        // Crear un objeto de búsqueda dinámico basado en el campo y la query
        const criterioBusqueda = { [campo]: { $regex: query, $options: 'i' } };

        // Buscar nombres únicos en el campo especificado que coincidan con la query
        const resultados = await correspondencia.distinct(campo, criterioBusqueda);

        res.json(resultados.slice(0, 10)); // Limitar el resultado a 10 sugerencias
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};

const listarPendientes = async (req, res) => {
    try {
        // Encontrar todos los elementos que tienen algo en el campo pendiente
        let pendientes = await correspondencia.find({ pendiente: { $regex: /^.{1,}$/ } }).sort({ numero_registro: 1 });

        if (!pendientes || pendientes.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron elementos pendientes"
            });
        }

        // Contar cuántos elementos tienen revisado igual a "Sí"
        const revisados = pendientes.filter(item => item.revisado === "Sí").length;

        // Filtrar los elementos que no tienen revisado igual a "Sí"
        pendientes = pendientes.filter(item => item.revisado !== "Sí");

        const totalPendientes = pendientes.length ;

        if (totalPendientes === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron elementos pendientes"
            });
        } else {
            return res.status(200).send({
                status: "success",
                totalPendientes: totalPendientes - revisados, // Restar los revisados del total
                pendientes
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los elementos pendientes"
        });
    }
};


module.exports={
    pruebaCorrespondencia,
    registrarCorrespondencia,
    cargarFotografia,
    borrarCorrespondencia,
    editarCorrespondencia,
    obtenerTemasCorrespondencia,
    listarPorTema,
    obtenerCorrespondenciaPorID,
    obtenerNumeroDeFotosPorPais,
    obtenerNumeroDeFotosPorInstitucion,
    obtenerTemasInstituciones,
    listarPorTemaEInstitucion,
    guardarPDF,
    obtenerNumeroDeBienesTotales,
    actualizarInstitucion,
    getChatGPTResponse,
    getTranscriptionFromImage,
    processTextAndImage,
    getSugerencias,
    listarPendientes
}

