const dotenv = require('dotenv');
const { Cell, Order } = require('../db');
const transportator = require("../nodemailer/configurations");


const webHooksFunction = async (req, res) => {
    try {
        const payment = req.query;
        console.log("Pago recibido de Mercado Pago:", payment);

        if (payment.type === "payment") {
            //const paymentStatus = payment.status; // Extraer el estado real del pago
            //     switch (paymentStatus) {
            //         case "approved":
            //             console.log("¡El pago está aprobado!");
            //             res.status(200).json({ message: "Pago aprobado" });
            //             break;
            //         case "pending":
            //             console.log("El pago está pendiente.");
            //             res.status(200).json({ message: "Pago pendiente" });
            //             break;
            //         case "rejected":
            //             console.log("El pago está rechazado.");
            //             res.status(200).json({ message: "Pago rechazado" });
            //             break;
            //         default:
            //             console.log("Estado de pago desconocido:", paymentStatus);
            //             res.status(200).json({ message: "Estado de pago desconocido" });
            //     }
            // } else {
            console.log("type payment:", payment.type);
            res.status(200).json({ message: "Notificación no relacionada con el pago" });
        }
    } catch (error) {
        console.error("Error al manejar la notificación webhook:", error);
        res.status(500).json({ message: "Error al procesar la notificación" });
    }
};

module.exports = { webHooksFunction };
