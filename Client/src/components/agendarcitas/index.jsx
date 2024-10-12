import "./agendarcitas.css";
// import "../../App.css";
import Calendario from "../../components/calendar";
// import FormCita from "../formCrearCita/index";
import logo from "../../img/logoAveza.png";
import { Link, useNavigate } from "react-router-dom";
import { getCasos, getCasosTodos, setFiltro } from "../../redux/actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCitaHandlers } from "../../handlers/crearCita";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../Mystyles";
import loading from "../../assets/loading.gif";

function AgendarCitas() {
const [dataRegistro, setDataRegistro] = useState({
  titulo: "",
  descripcion: "",
  fechaCita: "",
  horaCita: "",
  idCaso: "",
});

  const [errors, setErrors] = useState({});

  

const [isLoading, setIsLoading] = useState(true); // Estado para controlar la visualización del loading

// console.log(dataRegistro);

const dispatch = useDispatch();

const casos = useSelector((state) => state.casos);
const pages = useSelector((state) => state.pages);

  useEffect(() => {
  
    // if (filtro === "todos") {
    
      dispatch(getCasosTodos()).then(() => setIsLoading(false)); // Desactivar el loading después de cargar los casos
    // } else {
      
    // }
}, []);
  
  
// console.log("pages", pages);

const submitHandlerRegistro = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true); // Activar el loading antes de enviar la solicitud
    await postCitaHandlers(dataRegistro);
    // window.alert("Cita creado con éxito");
    window.location.reload();
  } catch (error) {
    console.error("Error al crear la cita:", error.message);
    window.alert("No se pudo crear la cita");
  } finally {
    setIsLoading(false); // Desactivar el loading después de la solicitud
  }
};

    const handleChangeSelect = (e) => {
      // e.preventDefault();

        const filtroCita = e.target.value;
        console.log("Target value", filtroCita);
        // setFiltro(filtroCita);
        window.localStorage.setItem("filtroCita", JSON.stringify(filtroCita));
      // console.log("Filtro change: ", filtro);
      dispatch(setFiltro(filtroCita));

    };
  
  const handleChangeRegistro = (e) => {
    const { name, value } = e.target
      ? e.target
      : { name: "fechaCita", value: e };
    setDataRegistro((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // setErrors(
    //   validation({
    //     ...dataRegistro,
    //     [name]: value,
    //   })
    // );
  };

if (isLoading || !pages || !pages.datosPagina) {
  return (
    <div className="loading-container">
      <img className="loading-image" src={loading} alt="loading" />
    </div>
  );
}


  //  console.log("casos2", casos);


  // console.log("registro", dataRegistro);
  
  return (
    <div className="containerDiary">
      <div className="encabezado">
        <p className="titulo">Agendar Cita</p>
      </div>
      <div className="calendario">
        <br />
        <Calendario></Calendario>
        <div className="containerCita">
          <select
            name="filtrocita"
            id="estado"
            className="selectcita"
            onChange={(e) => handleChangeSelect(e)}
          >
            <option value="" className="tipodecaso">
              Ver citas de:
            </option>
            <option value="todos" className="selectcita">
              Todos
            </option>
            <option value="usuario" className="selectcita">
              Usuario actual
            </option>
          </select>

          <form onSubmit={submitHandlerRegistro} className="formularioCita">
            <h1 className="tituloCita">Crear Cita</h1>
            <div className="input-row">
              <div className="infoCrearCita">
                <label className="labelCrearCita">Titulo:</label>
                <input
                  type="text"
                  name="titulo"
                  id="titulo"
                  className="inputCrearCita"
                  value={dataRegistro.titulo}
                  onChange={handleChangeRegistro}
                />
              </div>
              <div className="infoCrearCita">
                <label className="labelCrearCita">Fecha:</label>
                <DatePicker
                  className="inputCrearCita"
                  selected={dataRegistro.fechaCita}
                  name="fechaCita"
                  id="fechaCita"
                  onChange={(date) =>
                    handleChangeRegistro({
                      target: { name: "fechaCita", value: date },
                    })
                  }
                />
              </div>
              <div className="infoCrearCita">
                <label className="labelCrearCita">Hora:</label>
                <input
                  className="inputCrearCita"
                  type="time"
                  name="horaCita"
                  id="horaCita"
                  value={dataRegistro.horaCita}
                  onChange={handleChangeRegistro}
                />
              </div>
              <div className="infoCrearCita">
                <label className="labelCrearCita">Caso:</label>
                <select
                  className="inputCrearCita"
                  name="idCaso"
                  id="idCaso"
                  onChange={(event) => handleChangeRegistro(event)}
                >
                  <option value="" className="inputCrearCita">
                    Seleccionar caso
                  </option>
                  {pages.datosPagina?.map((caso) => (
                    <option
                      key={caso.id}
                      value={caso.id}
                      className="inputCrearCita"
                    >
                      {`${caso.tipoCaso} - ${caso.apellidosAbogado}/${caso.apellidosCliente}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br></br>
            <div className="infoCrearCita">
              <label className="labelCrearCita">Detalles:</label>
              <textarea
                className="inputCrearCita"
                type="textarea"
                name="descripcion"
                id="descripcion"
                cols="50"
                rows="6"
                value={dataRegistro.descripcion}
                onChange={handleChangeRegistro}
              ></textarea>
            </div>
            <div className="botonescrearcita">
              <Button onClick={submitHandlerRegistro}> Crear</Button>
              <Link to="/">
                <Button className="button">Volver</Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgendarCitas;

// import logo from "../../img/logoAveza.png";
// import "./agendarcitas.css";

// const AgendarCitas = (props) => {
//   return (
//     <div>
//       <div className="logo-aveza">
//         <img src={logo} alt="logo-aveza" title="AVEZA SAS" />
//       </div>
//       <h1 className="titulo">Agendar Cita</h1>
//       <br />

//       <form className="contenedoragendar">
//         <br />
//         <div className="recordatorio-cita">
//           <label for="fecha" className="label-recordatorio">
//             Ingrese fecha:
//           </label>
//           <input type="date" name="fecha" id="fecha" />
//           <label for="hora" className="label-recordatorio">
//             Ingrese hora:
//           </label>
//           <input type="time" name="hora" id="hora" />
//         </div>
//         <br />

//         <div className="recordatorio-cita">
//           <label for="aviso" className="label-recordatorio2">
//             {" "}
//             Enviar a:
//           </label>
//         </div>
//         <br />
//         <div className="recordatorio-cita">
//           <input type="checkbox" id="celular" name="aviso" value="celular" />
//           <label for="celular">Celular</label>
//           <input type="checkbox" id="email" name="aviso" value="Email" />
//           <label for="email">Email</label>
//         </div>
//         <br />
//         <div className="recordatorio-cita">
//           <label for="aviso" className="label-recordatorio2">
//             {" "}
//             Tipo de cita:
//           </label>
//         </div>
//         <br />
//         <div className="recordatorio-cita">
//           <input type="radio" name="cita" id="audiencia" />
//           <label for="audiencia">Audiencia</label>
//           <br />
//           <input type="radio" name="cita" id="reunion-abogado" />
//           <label for="reunion-abogado">Reunión con el abogado</label>
//         </div>
//         <br />
//         <div className="comentarios">
//           <label for="comentarios">Comentarios</label> <br />
//           <textarea
//             name="comentarios"
//             id="comentarios"
//             cols="30"
//             rows="10"
//           ></textarea>
//         </div>
//         <br />
//         <div className="botones">
//           <input type="submit" className="botones" value="Guardar" />
//         </div>
//         <br />
//       </form>
//     </div>
//   );
// };
// export default AgendarCitas;
