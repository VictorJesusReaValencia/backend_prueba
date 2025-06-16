const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/usuario'); // tu modelo

// Crear sesión de pago
const crearSesionPago = async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.id; // desde el token

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://tusitio.com/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://tusitio.com/cancelado`,
      metadata: {
        userId, // importante para saber a quién pertenece
      }
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear sesión de prueba (sin priceId)
const crearSesionDePrueba = async (req, res) => {
  const userId = req.user.id; // obtenido desde el token

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Membresía Premium de Prueba',
              description: 'Acceso a todo el contenido durante un mes',
            },
            unit_amount: 10000, // en centavos → 100.00 MXN
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/admin/success`,
      cancel_url: `http://localhost:5173/cancelado`,
      metadata: {
        userId,
      }
    });

    res.status(200).json({ id: session });
  } catch (error) {
    console.error("Error creando sesión de prueba:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crearSesionPago, crearSesionDePrueba };
