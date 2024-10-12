import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import {
  createPagosClientes,
} from "../pagosClientesControllers/postPagosClientes.js";

const obtenerPago = async (idPago) => {
  console.log("Payment id: ", idPago);
  console.log("Token:", process.env.ACCESSTOKEN);
  try {
    const { data } = await axios.get(
      `https://api.mercadopago.com/v1/payments/${idPago}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESSTOKEN}`,
        },
      }
    );
      console.log("Respuesta obtener pago: ", data.additional_info);
    const idCaso = data.additional_info.items[0].id;
    console.log("idCaso: ", data.additional_info.items[0].id);
    const orderId = data.order.id;
    const importeDeLaTransaccion = data.transaction_amount;
    const estado = data.status;
    const descripcion = data.description;
    const fechaDeAprobacion = data.date_approved;
    const tipoDePago = data.payment_type_id;
    const pagoId = data.id;
    
    const newPago = createPagosClientes(
      idCaso,
      descripcion,
      fechaDeAprobacion,
      pagoId,
      orderId,
      tipoDePago,
      estado,
      importeDeLaTransaccion
      
    );

    console.log("Pago creado:", newPago);
    return data;
  } catch (error) {
    console.log(error);
  }
};


export {
  obtenerPago,
};
