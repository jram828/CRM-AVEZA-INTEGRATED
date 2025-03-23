 import { models } from "../../DB.js";
 const {
  Cliente,
  Abogado,
  TipoDeCaso,
  PagosCliente,
  Solicitud,
  Sociedad,
  PropuestaPago,
  Proceso,
  ObligacionAlimentaria,
  Acreedor,
  Ciudad,
  Bien,
  Ingreso,
  Deuda,
  Gastos,
  Motivos
} = models
const getSolicitudCedula = async (cedula) => {
  console.log(cedula)

  const cliente = await Cliente.findOne({
    where: { cedulaCliente },
    include: [
        {
            model: Solicitud,
            include: [
                Acreedor,
                Bien,
                Ingreso,
                Proceso,
                Gastos,
                PropuestaPago,
                Deuda,
                Sociedad,
                ObligacionAlimentaria,
                Motivos
            ]
        }
    ]
});

  if (!cliente) throw Error("Cliente no existe");
  return cliente;
};
// intento subir

export  {
  getSolicitudCedula,
};


