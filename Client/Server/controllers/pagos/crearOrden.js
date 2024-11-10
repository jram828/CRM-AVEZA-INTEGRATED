import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from 'dotenv'
dotenv.config();
const { ACCESSTOKEN, VITE_URL } = process.env;


const crearOrden = async (item) => {
  // SDK de Mercado Pago
  const client = new MercadoPagoConfig({accessToken: ACCESSTOKEN || ""})

  //console.log('Estoy en el controller')
  //console.log('Body crear orden: ',item)
  
  try {

    let body = {
      items: [
        {
          id: item.id,
          title: item.description,
          //description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: "ARS",
        },
      ],
      payer: {
        // email: item.email,
        email: "test_user_1490493949@testuser.com",
      },
      payment_methods: {
        installments: 12,
      },
      back_urls: {
        success: `${VITE_URL}/pagos/status`,
        failure: `${VITE_URL}/pagos`,
        pending: `${VITE_URL}/pagos`,
      },
      notification_url: `${VITE_URL}/pagos/webhook`,
      auto_return: "approved",
    };

    const preference = new Preference(client);
    console.log('Estoy por crear la preferencia')
    const response = await preference.create({body});
    console.log('Response crear orden:',response)
   return response
  } catch (error) {
    console.log('Error en el controller')
    return error
}
};

export { crearOrden };