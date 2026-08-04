export const getHandler = async (req, res) => {
  try {
    // REQUISITO PREVIO: Asegúrate de que tu servidor Express pueda leer JSON.
    // Si tu CRM ya recibe datos POST, probablemente ya tienes esta línea en tu código base:
    // app.use(express.json());

    // Este token lo inventas tú. Debe ser idéntico al que pongas en el panel de Meta (Facebook Developers).
    const WHATSAPP_TOKEN = import.meta.env.WHATSAPP_TOKEN;

    // ---------------------------------------------------------
    // 1. RUTA GET: Verificación del Webhook
    // Meta hace una petición GET a esta ruta una única vez cuando lo configuras.
    // ---------------------------------------------------------

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
      // Verifica que el modo sea 'subscribe' y el token coincida con el tuyo
      if (mode === "subscribe" && token === WHATSAPP_TOKEN) {
        console.log("WEBHOOK VERIFICADO CORRECTAMENTE");
        // Tienes que devolver exactamente el 'challenge' que Meta te envió
        res.status(200).send(challenge);
      } else {
        // Si el token no coincide, responde con error 403 (Prohibido)
        res.sendStatus(403);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error verifying hook.");
  }
};

export const postHandler = async (req, res) => {
  try {
    // REQUISITO PREVIO: Asegúrate de que tu servidor Express pueda leer JSON.
    // Si tu CRM ya recibe datos POST, probablemente ya tienes esta línea en tu código base:
    // app.use(express.json());

    // 2. RUTA POST: Recepción de Mensajes
    // Meta hace una petición POST a esta ruta cada vez que un cliente te escribe.
    // ---------------------------------------------------------

    const body = req.body;

    // Verifica que la petición venga de tu cuenta de WhatsApp Business
    if (body.object === "whatsapp_business_account") {
      // La estructura del JSON de WhatsApp es profunda, hay que validarla paso a paso
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];

        // Extraemos los dos datos más importantes:
        const phoneNumber = message.from; // Número de WhatsApp del cliente
        const text = message.text.body; // El texto que escribió
        const messageId = message.id; // ID único del mensaje (útil para no procesar duplicados)

        console.log(`Mensaje recibido de ${phoneNumber}: ${text}`);

        // ---------------------------------------------------------
        // AQUÍ ES DONDE CONECTAS TU AGENTE DE IA
        // Ej: procesarMensajeConIA(text, phoneNumber);
        // ---------------------------------------------------------
      }

      // REGLA DE ORO DE META: Siempre responde con un 200 OK inmediatamente.
      // Si tardas más de unos segundos, Meta pensará que tu servidor falló
      // y empezará a reenviarte el mismo mensaje repetidamente.
      res.sendStatus(200);
    } else {
      // Responde con un 404 si el evento no es de WhatsApp
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error processing message.");
  }
};
