const hemerografia = require("../models/hemerografia")
const validator = require("validator")
const fs = require("fs");
const { constrainedMemory } = require("process");
const  OpenAIApi  = require("openai");


const openai = new OpenAIApi({
    apiKey: process.env.OPENIAKEY, // Rellena con tu API Key
    organization: process.env.ORG // Rellena con tu ID de Organización si es necesario
});
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
    let archivos = req.files;

    // Verificar si no se han recibido archivos
    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ninguna foto"
        });
    }

    console.log(archivos); // Para verificar que se están recibiendo múltiples archivos

    // Validar extensiones de archivos
    for (let archivo of archivos) {
        let archivo_split = archivo.originalname.split(".");
        let extension = archivo_split[archivo_split.length - 1].toLowerCase();
        if (extension !== "png" && extension !== "jpg" && extension !== "jpeg" && extension !== "gif") {
            // Borrar todos los archivos en caso de error de validación
            for (let file of archivos) {
                fs.unlink(file.path, () => {});
            }
            return res.status(500).json({
                status: "error",
                message: "Extensión de archivo no permitida",
                extension
            });
        }
    }

    // Si todas las extensiones son válidas, guardar los archivos y responder con éxito
    try {
        // Aquí puedes agregar lógica adicional para procesar las imágenes si es necesario

        return res.status(200).json({
            status: "success",
            message: "Foto registrada correctamente",
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
            },
            {
                $sort: { tema: 1 } // Ordenar alfabéticamente por tema
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
            const libroAleatorio = await hemerografia.aggregate([
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
        let fotos = await hemerografia.find({ tema: tema }).sort({ tema: 1 });

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

const listarPorTemaEInstitucion = async (req, res) => {
    const { institucionId, id: tema } = req.params;
    console.log(institucionId)
    console.log(tema)
    try {
        let fotos = await hemerografia.find({ tema: tema, institucion: institucionId }).sort({ numero_foto: 1 });

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


const obtenerNumeroDeFotosPorPais = async (req, res) => {
    let paisID = req.params.id;
  
    try {
      // Suponiendo que hemerografia es tu modelo de Mongoose
      let fotosCount = await hemerografia.countDocuments({ pais: paisID });
  
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
    // Suponiendo que hemerografia es tu modelo de Mongoose
    let fotosCount = await hemerografia.countDocuments({ institucion: paisID });

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
        const temas = await hemerografia.aggregate([
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
            const fotoAleatoria = await hemerografia.aggregate([
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

const obtenerCarpetasRecortes = async (req, res) => {
    try {
        // Obtener álbumes y número de fotos por álbum, excluyendo aquellos con null en numero_album
        const albumes = await hemerografia.aggregate([
            {
                $match: {
                    numero_carpeta: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$numero_carpeta",
                    numeroDeFotos: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    album: "$_id",
                    numeroDeFotos: 1
                }
            },
            {
                $sort: { album: 1 } // Orden ascendente por número de álbum
            }
        ]);

        if (!albumes.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron álbumes"
            });
        }

        // Obtener una foto aleatoria por cada álbum
        const albumesConFoto = await Promise.all(albumes.map(async album => {
            const fotoAleatoria = await hemerografia.aggregate([
                { $match: { numero_album: album.album } },
                { $sample: { size: 1 } }
            ]);

            return {
                ...album,
                fotoAleatoria: fotoAleatoria[0] ? fotoAleatoria[0].image : null // Asumiendo que la URL de la foto se encuentra en el campo 'image'
            };
        }));

        return res.status(200).json({
            status: "success",
            albumes: albumesConFoto
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los álbumes"
        });
    }
};
const listarPorCarpeta = async (req, res) => {
    const albumId = req.params.id;
    try {
        let fotos = await hemerografia.find({ numero_carpeta: albumId }).sort({ numero_registro: 1 });

        if (!fotos || fotos.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotos para esta carpeta"
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
const obtenerSeccionesRecortes = async (req, res) => {
    try {
        // Agrupar por sección y contar el número de bienes en cada una
        const secciones = await hemerografia.aggregate([
            {
                $match: {
                    seccion: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$seccion",
                    numeroDeBienes: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    seccion: "$_id",
                    numeroDeBienes: 1
                }
            },
            {
                $sort: { seccion: 1 } // Orden ascendente por sección
            }
        ]);

        if (!secciones.length) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron secciones"
            });
        }

        // Obtener todas las secciones registradas
        const todasLasSecciones = await hemerografia.distinct("seccion", { seccion: { $ne: null } });

        return res.status(200).json({
            status: "success",
            secciones: secciones,
            todasLasSecciones: todasLasSecciones
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener las secciones"
        });
    }
};

const listarPorSeccion = async (req, res) => {
    const seccionId = req.params.id;
    try {
        let bienes = await hemerografia.find({ seccion: seccionId }).sort({ numero_registro: 1 });

        if (!bienes || bienes.length === 0) {
            return res.status(404).json({
                status: "error",
                message: `No se encontraron bienes para la sección ${seccionId}`
            });
        } else {
            return res.status(200).send({
                status: "success",
                bienes
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los bienes"
        });
    }
};



const obtenerNumeroDeBienesTotales = async (req, res) => {
    try {
      // Suponiendo que Bienes es tu modelo de Mongoose
      let bienesCount = await hemerografia.countDocuments({});
  
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
        let fotosActualizadas = await hemerografia.updateMany(
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
const guardarPDF = async (req, res) => {
    console.log(req.files); // Para verificar que se están recibiendo múltiples archivos
    let archivos = Array.isArray(req.files) ? req.files : [req.files];
    let librosId = req.params.id;

    try {
        // Obtener título desde la base de datos
        const libro = await hemerografia.findById(librosId);
        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Libro no encontrado"
            });
        }
        let titulo = libro.encabezado; // Asumiendo que el título está en el campo 'encabezado' del documento

        console.log("se encuentra el libro");

        // Validar extensiones de archivos
        for (let archivo of archivos) {
            console.log("se entra en el bucle");
            let archivo_split = archivo.originalname.split(".");
            let extension = archivo_split[archivo_split.length - 1].toLowerCase();
         
        }
        console.log("se valida pdf");

        // Renombrar y mover archivos
        for (let [index, archivo] of archivos.entries()) {
            let nuevoNombre = `Hemerografia,${titulo}_${libro.numero_registro}_${index + 1}.${archivo.originalname.split('.').pop()}`;
            let nuevaRuta = path.join(__dirname, '../imagenes/hemerografia/pdf', nuevoNombre);

            await fs.promises.rename(archivo.path, nuevaRuta);
            archivo.filename = nuevoNombre;
        }
        console.log("se renombra y ruta");

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
        archivos.forEach(file => {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error(`Error eliminando el archivo ${file.path}:`, err);
            }
        });
        return res.status(500).json({
            status: "error",
            message: "Error en el servidor",
            error
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
        const resultados = await hemerografia.distinct(campo, criterioBusqueda);

        res.json(resultados.slice(0, 10)); // Limitar el resultado a 10 sugerencias
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar en la base de datos' });
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
    obtenerHemerografiaPorID,
    obtenerNumeroDeFotosPorPais,
    obtenerNumeroDeFotosPorInstitucion,
    obtenerTemasInstituciones,
    listarPorTemaEInstitucion,
    obtenerCarpetasRecortes,
    listarPorCarpeta,
    obtenerNumeroDeBienesTotales,
    actualizarInstitucion,
    obtenerSeccionesRecortes,
    listarPorSeccion,
    guardarPDF,
    getChatGPTResponse,
    getTranscriptionFromImage,
    processTextAndImage,
    getSugerencias
}

