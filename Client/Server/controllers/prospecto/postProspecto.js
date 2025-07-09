const { Prospecto, Ciudad, TipoDeCaso, TipoUsuario } = require("../../DB_conn");
const codigoCiudades = require("../../utils/codigoCiudades").default;
const tipoUsuarios = require("../../utils/tipoUsuarios");
const tipoDeCasos = require("../../utils/tipoDeCasos");

const postProspecto = async (req, res) => {
  const {
    email,
    nombres,
    apellidos,
    cedula,
    celular,
    direccion,
    nombre_ciudad,
    tipo_usuario,
    tipo_de_caso,
    forma_de_pago,
    honorarios,
    cuotas,
    comentarios,
    valor_pretensiones,
  } = req.body;

  const ciudadfilter = codigoCiudades.filter(
    (ciudad) => ciudad.nombre_ciudad === nombre_ciudad.toUpperCase()
  );
  const codigo_ciudad = ciudadfilter[0].codigo_ciudad;
  console.log("Codigo ciudad:", codigo_ciudad);

  console.log("ciudad:", ciudadfilter);
  console.log("Body:", {
    email,
    nombres,
    apellidos,
    cedula,
    celular,
    direccion,
    nombre_ciudad,
    tipo_usuario,
    tipo_de_caso,
    forma_de_pago,
    honorarios,
    cuotas,
    comentarios,
    valor_pretensiones,
  });
  if (
    !email ||
    !nombres ||
    !apellidos ||
    !cedula ||
    !celular ||
    nombres.length === 0 ||
    email.length === 0 ||
    cedula.length === 0 ||
    celular.length === 0
  ) {
    console.log("Faltan datos.");
    res.status(400).send("Faltan datos");
  } else {
    try {
      const newProspecto = await Prospecto.create({
        cedulaProspecto: cedulaProspecto,
        email: email,
        nombres: nombres,
        apellidos: apellidos,
        celular: celular,
        direccion: direccion,
        forma_de_pago: forma_de_pago,
        honorarios: honorarios,
        cuotas: cuotas,
        comentarios: comentarios,
        valor_pretensiones: valor_pretensiones,
      });

      newProspecto.addCiudad(codigo_ciudad);
      newProspecto.addTipoDeCaso(tipo_de_caso);
      newProspecto.addTipoUsuario(tipo_usuario);

      return res.status(200).json(newProspecto);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
};

module.exports = postProspecto;
