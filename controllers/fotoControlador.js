const Fotografia = require("../models/fotografia");
const fotografia = require("../models/fotografia");
const validator = require("validator")
const fs = require("fs")

const listar = async (req, res) => {
    try {
        let fotos = await Fotografia.find({}).sort({numero_foto:1});

        if (!fotos) {
            return res.status(404).json({
                status: "error",
                message: "nelprro"
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
            message: "nelprro"
        });
    }
};

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );
    
    await jwtClient.authorize();
    return jwtClient;
    }

// controllers/fotoControlador.js
const pruebaFoto = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado joder"
    });
}
//Registrar foto
const registrarfoto2 = async (req,res) =>{
    //Recojer parametros por post a guardar
    let parametros = req.body;
    
    // validar datos
    try{
    // Crear un objeto guardar
    const articulo = new fotografia(parametros);
        
    // Guardar el articulo
    const articuloGuardado = await articulo.save();    
    return res.status(200).json({
        status : "successs",
        mensaje: "arre con el articulo",
        articuloGuardado
    })
    }catch(error){
        return res.status(400).json({
            status : "error",
            mensaje: "Faltan datos por enviar3",
            parametros

        })

    }
}
const subir_foto= async (req,res) =>{
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

        let fotografiaID = req.params.id;

        try {
            const fotografiaActualizada = await Fotografia.findOneAndUpdate(
                { _id: fotografiaID },
                { image: req.file.filename },
                { new: true }
            );

            if (!fotografiaActualizada) {
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

const borrar = async (req, res) => {
    const id = req.params.id;

    try {
        let foto = await Fotografia.findOneAndDelete({ _id: id });

        if (!foto) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada",
                id
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto borrada exitosamente"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al borrar la foto"
        });
    }
};
const editar = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let foto = await Fotografia.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!foto) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Foto actualizada exitosamente",
                foto
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar la foto"
        });
    }
};
const obtenerFotoPorID = async (req, res) => {
    let fotoID = req.params.id;

    try {
        let foto = await Fotografia.findById(fotoID);

        if (!foto) {
            return res.status(404).json({
                status: "error",
                message: "Foto no encontrada"
            });
        } else {
            return res.status(200).json({
                status: "success",
                foto
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener la foto"
        });
    }
};

  
// obtener paises
const obtenerPaises = async (req, res) => {
    try {
        const paises = await Fotografia.aggregate([
            {
                $group: {
                    _id: "$pais",
                    numeroDeFotos: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    pais: "$_id",
                    numeroDeFotos: 1
                }
            }
        ]);

        if (!paises) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron países"
            });
        } else {
            return res.status(200).json({
                status: "success",
                paises
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los países"
        });
    }
};
const obtenerTemas = async (req, res) => {
    try {
        // Obtener temas y número de fotos por tema
        const temas = await Fotografia.aggregate([
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
            const fotoAleatoria = await Fotografia.aggregate([
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
const obtenerAlbumes = async (req, res) => {
    try {
        // Obtener álbumes y número de fotos por álbum
        const albumes = await Fotografia.aggregate([
            {
                $group: {
                    _id: "$numero_album",
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
            const fotoAleatoria = await Fotografia.aggregate([
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
const listarPorAlbum = async (req, res) => {
    const albumId = req.params.id;
    try {
        let fotos = await Fotografia.find({ numero_album: albumId }).sort({ numero_foto: 1 });

        if (!fotos || fotos.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No se encontraron fotos para este álbum"
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
      // Suponiendo que Fotografia es tu modelo de Mongoose
      let fotosCount = await Fotografia.countDocuments({ pais: paisID });
  
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
    // Suponiendo que Fotografia es tu modelo de Mongoose
    let fotosCount = await Fotografia.countDocuments({ institucion: paisID });

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
            const temas = await Fotografia.aggregate([
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
                const fotoAleatoria = await Fotografia.aggregate([
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

const listarPorTemaEInstitucion = async (req, res) => {
    const { institucionId, id: tema } = req.params;
    console.log(institucionId)
    console.log(tema)
    try {
        let fotos = await Fotografia.find({ tema: tema, institucion: institucionId }).sort({ numero_foto: 1 });

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

module.exports = { pruebaFoto,
                registrarfoto2,
                subir_foto, 
                listar, 
                obtenerFotoPorID, 
                obtenerPaises, 
                obtenerTemas, 
                obtenerAlbumes,
                listarPorAlbum, 
                borrar, 
                editar,
                obtenerNumeroDeFotosPorPais,
                obtenerNumeroDeFotosPorInstitucion,
                obtenerTemasInstituciones,
                listarPorTemaEInstitucion
            }