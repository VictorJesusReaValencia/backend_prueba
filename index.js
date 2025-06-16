require('dotenv').config(); // Siempre primero
const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./models/usuario');

connection();

const app = express();
const puerto = process.env.PORT || 3900;

// Configurar CORS
app.use(cors({ origin: "*" }));

// ⚠️ Webhook debe ir antes del express.json()
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log("❌ Error en la firma del webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      const user = await User.findById(userId);
      if (user) {
        user.role = "premium";
        await user.save();
        console.log("✅ Usuario actualizado a premium:", user.email);
      }
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err.message);
    }
  }

  res.status(200).send('Evento recibido');
});

// ✅ Después de webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Importar rutas
const FotoRoutes = require('./routes/fotoRuta');
const userRoutes = require("./routes/userRuta");
const HemerografiaRoutes = require("./routes/hemerografiasRuta");
const IconografiafiaRoutes = require("./routes/iconografiaRuta");
const LibrosRoutes = require("./routes/libroRuta");
const CorrespondenciaRoutes = require("./routes/correspondenciaRuta");
const DocumentacionRoutes = require("./routes/documentacionRuta");
const PartiturasRoutes = require("./routes/partiturasRuta");
const ObjetosRoutes = require("./routes/objetosRuta");
const MonumentosRoutes = require("./routes/monumentosRuta");
const InstitucionesRoutes = require("./routes/institucionesRuta");
const PeriodicosRoutes = require("./routes/periodicosRuta");

// Rutas
app.use("/api/periodicos", PeriodicosRoutes);
app.use("/api/instituciones", InstitucionesRoutes);
app.use("/api/documentacion", DocumentacionRoutes);
app.use("/api/monumentos", MonumentosRoutes);
app.use("/api/objetos", ObjetosRoutes);
app.use("/api/partituras", PartiturasRoutes);
app.use("/api/correspondencia", CorrespondenciaRoutes);
app.use("/api/libros", LibrosRoutes);
app.use("/api/iconografia", IconografiafiaRoutes);
app.use("/api/hemerografia", HemerografiaRoutes);
app.use("/api/fotografia", FotoRoutes);
app.use("/api/user", userRoutes);

// Servidor
app.listen(puerto, () => {
  console.log("Servidor de node corriendo en el puerto:", puerto);
});
