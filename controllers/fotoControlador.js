const Fotografia = require("../models/fotografia");
const fotografia = require("../models/fotografia");
const validator = require("validator")
const fs = require("fs")
const OpenAIApi = require("openai");
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const bucket = require('../database/firebase_config'); // Asegúrate de tener este archivo

const pruebaFoto = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado joder"
    });
}
//#########################################################################################################//
//-----------------------------------------Formularios--------------------------------------------------//
//##########################################################################################################//
// controllers/fotoControlador.js
const getSugerencias = async (req, res) => {
    try {
        const { query, campo } = req.query; // Obtener la query y el campo de la solicitud
        if (!query || !campo) {
            return res.status(400).json({ error: 'Se requieren un término de búsqueda y un campo válido' });
        }

        // Crear un objeto de búsqueda dinámico basado en el campo y la query
        const criterioBusqueda = { [campo]: { $regex: query, $options: 'i' } };

        // Buscar nombres únicos en el campo especificado que coincidan con la query
        const resultados = await fotografia.distinct(campo, criterioBusqueda);

        res.json(resultados.slice(0, 10)); // Limitar el resultado a 10 sugerencias
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar en la base de datos' });
    }
};
//-----------------------------------------------Guardar-Editar-Borrar datos--------------------------------------------------//
const registrarfoto2 = async (req, res) => {
    //Recojer parametros por post a guardar
    let parametros = req.body;

    // validar datos
    try {
        // Crear un objeto guardar
        const articulo = new fotografia(parametros);

        // Guardar el articulo
        const articuloGuardado = await articulo.save();
        return res.status(200).json({
            status: "successs",
            mensaje: "arre con el articulo",
            articuloGuardado
        })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar3",
            parametros

        })

    }
}
const registrarFoto = async (req, res) => {
    let parametros = req.body;

    try {
        // 👉 Formatear la fecha de publicación si viene incluida
        if (parametros.fecha_publicacion) {
            const fechaOriginal = new Date(parametros.fecha_publicacion);
            parametros.fecha_publicacion = format(fechaOriginal, 'yyyy-MM-dd');
        }

        // 👉 Asignar la fecha de registro legible
        parametros.fecha_registro = new Date()

        // 👉 Crear y guardar la publicación
        const publicacion = new fotografia(parametros);
        const publicacionGuardada = await publicacion.save();

        return res.status(200).json({
            status: "success",
            mensaje: "Publicación  guardada correctamente",
            publicacionGuardada
        });

    } catch (error) {
        console.error("🔥 Error real:", error);

        return res.status(400).json({
            status: "error",
            mensaje: error.message || "Error desconocido",
            error: error.errors || error,
            parametros
        });
    }
};
const registrarFotografia = async (req, res) => {
    const archivos = req.files;
    const id = req.params.id;

    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ninguna foto"
        });
    }

    const urlsFirebase = [];

    try {
        const doc = await fotografia.findById(id);
        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Registro no encontrado"
            });
        }

        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const descripcion = limpiarTexto(doc.descripcion);

        for (let archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
                return res.status(400).json({
                    status: "error",
                    message: "Extensión no permitida",
                    extension
                });
            }

            const bufferOptimizado = await sharp(archivo.buffer)
                .resize({ width: 1200 })
                .jpeg({ quality: 80 })
                .toBuffer();

            // 🧠 Generar nombre limitado a 50 caracteres (sin contar timestamp)
            let baseName = `Fotografia_${descripcion}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombreFirebase = `${baseName}_${timestamp}`;
            const uuid = uuidv4();

            const file = bucket.file(nombreFirebase);

            await file.save(bufferOptimizado, {
                metadata: {
                    contentType: "image/jpeg",
                    metadata: { firebaseStorageDownloadTokens: uuid }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombreFirebase)}?alt=media&token=${uuid}`;

            urlsFirebase.push({ nombre: nombreFirebase, url });
        }

        doc.imagenes_fb = urlsFirebase;
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "Fotos subidas y guardadas correctamente",
            imagenes_fb: urlsFirebase
        });

    } catch (error) {
        console.error("❌ Error al subir o guardar imágenes:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al procesar imágenes",
            error
        });
    }
};
const registrarPDF = async (req, res) => {
    const archivos = Array.isArray(req.files) ? req.files : [req.files];
    const librosId = req.params.id;

    try {
        const libro = await fotografia.findById(librosId);
        if (!libro) {
            return res.status(404).json({
                status: "error",
                message: "Hemerografía no encontrada"
            });
        }

        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const descripcion = limpiarTexto(libro.descripcion);

        const pdfsFirebase = [];

        for (let archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (extension !== "pdf") {
                return res.status(400).json({
                    status: "error",
                    message: `Archivo no permitido: ${archivo.originalname}`,
                });
            }

            let baseName = `Fotografia_PDF_${descripcion}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombrePDF = `${baseName}_${timestamp}`;
            const uuid = uuidv4();
            const file = bucket.file(nombrePDF);

            await file.save(archivo.buffer, {
                metadata: {
                    contentType: "application/pdf",
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombrePDF)}?alt=media&token=${uuid}`;

            pdfsFirebase.push({ nombre: nombrePDF, ruta: url });
        }

        libro.pdfs = pdfsFirebase;
        await libro.save();

        return res.status(200).json({
            status: "success",
            message: "PDFs subidos correctamente",
            pdfs: pdfsFirebase
        });

    } catch (error) {
        console.error("❌ Error al subir PDFs:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error en el servidor",
            error
        });
    }
};
// Borrar una fotografia y sus imágenes asociadas
const borrarFoto = async (req, res) => {
    const id = req.params.id;

    try {
        const doc = await fotografia.findById(id);

        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "foto no encontrada"
            });
        }

        let erroresEliminacion = [];

        // 🗑️ Eliminar imágenes de Firebase
        if (doc.imagenes_fb && doc.imagenes_fb.length > 0) {
            for (const imagen of doc.imagenes_fb) {
                try {
                    const pathName = decodeURIComponent(imagen.url.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ Imagen eliminada de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar la imagen: ${imagen.nombre}`);
                    erroresEliminacion.push(`imagen: ${imagen.nombre}`);
                }
            }
        }

        // 🗑️ Eliminar PDFs de Firebase
        if (doc.pdfs && doc.pdfs.length > 0) {
            for (const pdf of doc.pdfs) {
                try {
                    const pathName = decodeURIComponent(pdf.ruta.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ PDF eliminado de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar el PDF: ${pdf.nombre}`);
                    erroresEliminacion.push(`pdf: ${pdf.nombre}`);
                }
            }
        }

        // ❌ Si hubo errores, NO se borra el documento
        if (erroresEliminacion.length > 0) {
            return res.status(500).json({
                status: "error",
                message: "No se pudieron eliminar todos los archivos, el documento no fue borrado",
                archivosNoEliminados: erroresEliminacion
            });
        }

        // ✅ Si todo fue eliminado correctamente, borrar el documento de MongoDB
        await fotografia.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            message: "Foto, imágenes y PDFs eliminados correctamente"
        });

    } catch (error) {
        console.error("❌ Error en borrarFoto:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error al borrar la foto"
        });
    }
};
const borrarFotografias = async (req, res) => {
    const id = req.params.id;

    try {
        const doc = await fotografia.findById(id);

        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Fotografía no encontrada"
            });
        }

        let erroresEliminacion = [];

        // 🗑️ Eliminar imágenes de Firebase
        if (doc.imagenes_fb && doc.imagenes_fb.length > 0) {
            for (const imagen of doc.imagenes_fb) {
                try {
                    const pathName = decodeURIComponent(imagen.url.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ Imagen eliminada de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar la imagen: ${imagen.nombre}`);
                    erroresEliminacion.push(imagen.nombre);
                }
            }
        }

        // ❌ Si hubo errores, no se actualiza MongoDB
        if (erroresEliminacion.length > 0) {
            return res.status(500).json({
                status: "error",
                message: "No se pudieron eliminar todas las imágenes de Firebase",
                imagenesNoEliminadas: erroresEliminacion
            });
        }

        // ✅ Actualizar documento en MongoDB eliminando el campo `imagenes_fb`
        doc.imagenes_fb = [];
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "Todas las imágenes fueron eliminadas de Firebase y MongoDB"
        });

    } catch (error) {
        console.error("❌ Error en borrarFotografias:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error al borrar las imágenes"
        });
    }
};
const borrarPdfs = async (req, res) => {
    const id = req.params.id;

    try {
        const doc = await fotografia.findById(id);

        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Fotografía no encontrada"
            });
        }

        let erroresEliminacion = [];

        // 🗑️ Eliminar PDFs de Firebase
        if (doc.pdfs && doc.pdfs.length > 0) {
            for (const pdf of doc.pdfs) {
                try {
                    const pathName = decodeURIComponent(pdf.ruta.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ PDF eliminado de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar el PDF: ${pdf.nombre}`);
                    erroresEliminacion.push(pdf.nombre);
                }
            }
        }

        // ❌ Si hubo errores, no se actualiza MongoDB
        if (erroresEliminacion.length > 0) {
            return res.status(500).json({
                status: "error",
                message: "No se pudieron eliminar todos los PDFs de Firebase",
                pdfsNoEliminados: erroresEliminacion
            });
        }

        // ✅ Actualizar documento en MongoDB eliminando el campo `pdfs`
        doc.pdfs = [];
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "Todos los PDFs fueron eliminados de Firebase y MongoDB"
        });

    } catch (error) {
        console.error("❌ Error en borrarPdfs:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error al borrar los PDFs"
        });
    }
};
// Editar una fotografía existente
const editarFoto = async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    try {
        let foto = await foto.findByIdAndUpdate(id, datosActualizados, { new: true });

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
            message: "Error al actualizar la hemerografía",
            error: error.message || "Error desconocido"
        });
    }
};
const editarFotografia = async (req, res) => {
    const archivos = req.files;
    const id = req.params.id;

    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ninguna foto"
        });
    }

    const urlsFirebase = [];

    try {
        const doc = await fotografia.findById(id);
        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Registro no encontrado"
            });
        }

        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const descripcion = limpiarTexto(doc.descripcion);

        // 🧹 Eliminar imágenes anteriores de Firebase
        if (doc.imagenes_fb && doc.imagenes_fb.length > 0) {
            for (const imagen of doc.imagenes_fb) {
                try {
                    const pathName = decodeURIComponent(imagen.url.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ Imagen eliminada de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar la imagen: ${imagen.nombre}`);
                }
            }
        }

        // 🆕 Subir nuevas imágenes
        for (const archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
                return res.status(400).json({
                    status: "error",
                    message: "Extensión no permitida",
                    extension
                });
            }

            const bufferOptimizado = await sharp(archivo.buffer)
                .resize({ width: 1200 })
                .jpeg({ quality: 80 })
                .toBuffer();

            // 📛 Generar nombre truncado
            let baseName = `Fotografia_${descripcion}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombreFirebase = `${baseName}_${timestamp}`;
            const uuid = uuidv4();

            const file = bucket.file(nombreFirebase);

            await file.save(bufferOptimizado, {
                metadata: {
                    contentType: "image/jpeg",
                    metadata: { firebaseStorageDownloadTokens: uuid }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombreFirebase)}?alt=media&token=${uuid}`;

            urlsFirebase.push({ nombre: nombreFirebase, url });
        }

        // 💾 Guardar nuevas imágenes en MongoDB
        doc.imagenes_fb = urlsFirebase;
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "Fotos actualizadas correctamente",
            imagenes_fb: urlsFirebase
        });

    } catch (error) {
        console.error("❌ Error en editarFotografia:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error desconocido",
            error
        });
    }
};
const editarPDFs = async (req, res) => {
    const archivos = req.files;
    const id = req.params.id;

    if (!archivos || archivos.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "No se ha recibido ningún PDF"
        });
    }

    const pdfsFirebase = [];

    try {
        const doc = await fotografia.findById(id);
        if (!doc) {
            return res.status(404).json({
                status: "error",
                message: "Registro no encontrado"
            });
        }

        // 🧼 Eliminar PDFs anteriores
        if (doc.pdfs && doc.pdfs.length > 0) {
            for (const pdf of doc.pdfs) {
                try {
                    const pathName = decodeURIComponent(pdf.ruta.split("/o/")[1].split("?")[0]);
                    const file = bucket.file(pathName);
                    await file.delete();
                    console.log(`🗑️ PDF eliminado de Firebase: ${pathName}`);
                } catch (error) {
                    console.warn(`⚠️ No se pudo eliminar el PDF: ${pdf.nombre}`);
                }
            }
        }

        // 🔤 Normalizar nombres
        const limpiarTexto = (texto) =>
            texto ? texto.replace(/[\/\\?%*:|"<>]/g, "").trim() : "SinNombre";

        const descripcion = limpiarTexto(doc.descripcion);
        //const encabezado = limpiarTexto(doc.encabezado);

        // 📤 Subir nuevos PDFs
        for (const archivo of archivos) {
            const extension = archivo.originalname.split(".").pop().toLowerCase();
            if (extension !== "pdf") {
                return res.status(400).json({
                    status: "error",
                    message: "Solo se permiten archivos PDF",
                    extension
                });
            }

            let baseName = `Foto_PDF_${descripcion}`;
            if (baseName.length > 50) {
                baseName = baseName.slice(0, 50);
            }

            const timestamp = Date.now();
            const nombreFirebase = `${baseName}_${timestamp}`;
            const uuid = uuidv4();
            const file = bucket.file(nombreFirebase);

            await file.save(archivo.buffer, {
                metadata: {
                    contentType: "application/pdf",
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            });

            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(nombreFirebase)}?alt=media&token=${uuid}`;

            pdfsFirebase.push({ nombre: nombreFirebase, ruta: url });
        }

        // 💾 Guardar en MongoDB
        doc.pdfs = pdfsFirebase;
        await doc.save();

        return res.status(200).json({
            status: "success",
            message: "PDFs actualizados correctamente",
            pdfs: pdfsFirebase
        });

    } catch (error) {
        console.error("❌ Error en editarPDFs:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error desconocido",
            error
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
//-----------------------------------------------Buscador--------------------------------------------------//
const buscarFotografia = async (req, res) => {
    try {
        const {
            texto,
            anioInicio,
            anioFin,
            fecha_publicacion,
            pais,
            ciudad,
            periodico
        } = req.query;

        const filtros = {};

        // Filtro de texto libre
        if (texto && texto.trim() !== "") {
            const regex = new RegExp(texto.trim(), "i");
            filtros.$or = [
                { nombre_periodico: regex },
                { tema: regex },
                { encabezado: regex },
                { autor: regex },
                { seccion: regex },
                { resumen: regex }
            ];
        }

        // Filtro por año exacto (rango añoInicio - añoFin)
        if (anioInicio || anioFin) {
            const desde = anioInicio ? new Date(`${anioInicio}-01-01`) : new Date("1700-01-01");
            const hasta = anioFin ? new Date(`${anioFin}-12-31T23:59:59`) : new Date();

            filtros.fecha_publicacion = {
                $gte: desde,
                $lte: hasta
            };
        }

        // Filtro por fecha exacta
        if (fecha_publicacion) {
            const fecha = new Date(fecha_publicacion);
            const siguienteDia = new Date(fecha);
            siguienteDia.setDate(fecha.getDate() + 1);

            filtros.fecha_publicacion = {
                $gte: fecha,
                $lt: siguienteDia
            };
        }

        // Filtros directos
        if (pais) filtros.pais = new RegExp(pais, "i");
        if (ciudad) filtros.ciudad = new RegExp(ciudad, "i");
        if (periodico) filtros.nombre_periodico = new RegExp(periodico, "i");

        const resultados = await hemerografia.find(filtros).limit(50);

        return res.status(200).json({
            status: "success",
            resultados
        });

    } catch (error) {
        console.error("❌ Error en la búsqueda:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al realizar la búsqueda",
            error
        });
    }
};
//#########################################################################################################//
//-----------------------------------------Tema, tema e insitucion y detalle--------------------------------------------------//
//##########################################################################################################//
//-----------------------------------------------Listar--------------------------------------------------//
const listarPorTema = async (req, res) => {
    const tema = req.params.id;
    try {
        let fotos = await Fotografia.find({ tema: tema }).sort({ tema: 1 });

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
const listar = async (req, res) => {
    try {
        let fotos = await Fotografia.find({}).sort({ numero_foto: 1 });

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
const listarPendientes = async (req, res) => {
    try {
        // Encontrar todos los elementos que tienen algo en el campo pendiente
        let pendientes = await fotografia.find({ pendiente: { $regex: /^.{1,}$/ } }).sort({ numero_registro: 1 });

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

        const totalPendientes = pendientes.length;

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
//#########################################################################################################//
//-----------------------------------------Acervo e instituciones--------------------------------------------------//
//##########################################################################################################//
//-----------------------------------------------Obtener numeros de registros--------------------------------------------------//
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
//-----------------------------------------------Temas--------------------------------------------------//
const obtenerTemasInstituciones = async (req, res) => {
    try {
        const institucionId = req.params.id;

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

        // Obtener una foto aleatoria por cada tema y el valor del primer elemento en el campo nombre
        const temasConFotoYNombre = await Promise.all(temas.map(async tema => {
            const fotoAleatoria = await Fotografia.aggregate([
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
const obtenerNumeroDeBienesTotales = async (req, res) => {
    try {
        // Total de bienes
        const total = await fotografia.countDocuments({});

        // Revisados (campo "revisado" igual a "Si")
        const revisados = await fotografia.countDocuments({ revisado: "Si" });

        // Pendientes (campo "pendiente" no nulo ni vacío)
        const pendientes = await fotografia.countDocuments({
            pendiente: { $exists: true, $ne: null, $ne: "" }
        });

        return res.status(200).json({
            status: "success",
            total,
            revisados,
            pendientes
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el número de bienes",
            error: error.message
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
        // Obtener álbumes y número de fotos por álbum, excluyendo aquellos con null en numero_album
        const albumes = await Fotografia.aggregate([
            {
                $match: {
                    numero_album: { $ne: null }
                }
            },
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
const actualizarInstitucion = async (req, res) => {
    const { institucionanterior, institucionueva } = req.params;

    try {
        // Buscar todas las fotos que tengan la institución anterior
        let fotosActualizadas = await Fotografia.updateMany(
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
//Registrar foto
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


module.exports = {
    pruebaFoto,
    registrarfoto2,
    registrarFoto,
    editarFoto,
    editarPDFs,
    registrarFoto,
    registrarFotografia,
    listar,
    obtenerFotoPorID,
    obtenerPaises,
    obtenerTemas,
    obtenerAlbumes,
    editarFotografia,
    listarPorTema,
    listarPorAlbum,
    borrar,
    borrarFoto,
    borrarFotografias,
    borrarPdfs,
    editar,
    obtenerNumeroDeFotosPorPais,
    obtenerNumeroDeFotosPorInstitucion,
    obtenerTemasInstituciones,
    listarPorTemaEInstitucion,
    obtenerNumeroDeBienesTotales,
    actualizarInstitucion,
    registrarPDF,
    getSugerencias,
    listarPendientes
}