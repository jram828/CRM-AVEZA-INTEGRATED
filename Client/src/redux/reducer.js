// import {
//   ADD_REVIEW,
//   FETCH_REVIEWS_ALL,
//   FETCH_REVIEWS_SUCCESS,
//   FETCH_REVIEWS_FAILURE,
//   ADD_REVIEW_FAILURE,
// } from "./actions";

import {
  SET_AUTHENTICATED,
  SET_USERTOKEN,
  GET_ABOGADOS,
  GET_ABOGADOS_TODOS,
  GET_CLIENTES,
  GET_CLIENTES_CASOS,
  GET_CLIENTES_TODOS,
  GET_PROSPECTOS,
  GET_PROSPECTOS_CASOS,
  GET_PROSPECTOS_TODOS,
  GET_BY_ID_ABOGADO,
  GET_BY_ID_CLIENTE,
  GET_BY_ID_PROSPECTO,
  FILTER_ABOGADO,
  FILTER_CLIENTE,
  FILTER_PROSPECTO,
  SET_SOURCE,
  ORDER_ABOGADOS,
  ORDER_CLIENTES,
  ORDER_PROSPECTOS,
  DELETE_ABOGADO,
  DELETE_CLIENTE,
  DELETE_PROSPECTO,
  GET_TIPOSDECASOS,
  GET_CASOS,
  GET_CASOS_TODOS,
  FILTER_CASOS,
  ORDER_CASOS,
  GET_CASO_BY_ID,
  POST_CITA,
  GET_CITAS,
  POST_CONSULTA,
  // LOGIN,
  // LOGIN_FAILED,
  // LOG_FAILED,
  CLEAN_USER,
  SET_ABOGADO,
  SET_CLIENTE,
  SET_PROSPECTO,
  SET_CASO,
  DELETE_CASO,
  GET_CONSULTAS,
  GET_CONSULTAS_TODOS,
  MODIFICAR_DATOS,
  MODIFICAR_DATOS_ABOGADO,
  GET_PAGOS,
  MODIFICAR_CASO,
  MODIFICAR_CASO_COTIZACION,
  FIN_CASO,
  FILTER_CITAS,
  SET_FILTRO,
  DELETE_CONSULTA,
  POST_INSOLVENCIA,
  GET_SOLICITUD_BY_CEDULA,
  CREAR_DEUDAS,
} from "./actions";

let initialState = {
  usuario: {},
  isAuthenticated: false,
  user: {},
  abogados: [],
  clientes: [],
  prospectos: [],
  abogado: {},
  cliente: {},
  prospecto: {},
  tiposDeCasos: [],
  casos: [],
  caso: {},
  cita: [],
  citas: [],
  deudas: [],
  filtro: [],
  consultas: [],
  pagos: [],
  source: "cliente",
  reviews: [],
  pages: [],
  insolvencia: [],
  solicitud: {},
  reviewError: "",
  // userGit: null,
  loginError: "",
  logError: "",
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case SET_USERTOKEN:
      return {
        ...state,
        user: action.payload,
      };
    case SET_FILTRO:
      return {
        ...state,
        filtro: action.payload,
      };
    case GET_ABOGADOS:
      return {
        ...state,
        abogados: action.payload,
      };
    case GET_ABOGADOS_TODOS:
      return {
        ...state,
        pages: action.payload,
      };
    case GET_CLIENTES:
      return {
        ...state,
        clientes: action.payload,
      };
    case GET_PROSPECTOS:
      return {
        ...state,
        prospectos: action.payload,
      };
    case GET_CLIENTES_TODOS:
      return {
        ...state,
        pages: action.payload,
      };

          case GET_PROSPECTOS_TODOS:
      return {
        ...state,
        pages: action.payload,
      };
    case GET_CLIENTES_CASOS:
      return {
        ...state,
        pages: action.payload,
      };
          case GET_PROSPECTOS_CASOS:
      return {
        ...state,
        pages: action.payload,
      };
    case GET_BY_ID_ABOGADO:
      //window.localStorage.setItem("abogado", JSON.stringify(action.payload));
      return {
        ...state,
        abogados: action.payload,
      };
    case GET_BY_ID_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };
          case GET_BY_ID_PROSPECTO:
      return {
        ...state,
        prospecto: action.payload,
      };
    case FILTER_ABOGADO:
      return {
        ...state,
        abogados: action.payload,
      };
    case FILTER_CLIENTE:
      return {
        ...state,
        clientes: action.payload,
      };

          case FILTER_PROSPECTO:
      return {
        ...state,
        prospectos: action.payload,
      };

    case SET_SOURCE:
      return {
        ...state,
        source: action.payload,
      };
    case SET_ABOGADO:
      return {
        ...state,
        abogado: action.payload,
      };
    case SET_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };
          case SET_PROSPECTO:
      return {
        ...state,
        prospecto: action.payload,
      };
    case SET_CASO:
      return {
        ...state,
        caso: action.payload,
      };
    case ORDER_ABOGADOS:
      return {
        ...state,
        abogados: action.payload,
      };

    case ORDER_CLIENTES:
      return {
        ...state,
        clientes: action.payload,
      };

          case ORDER_PROSPECTOS:
      return {
        ...state,
        prospectos: action.payload,
      };
    case DELETE_ABOGADO:
      return {
        ...state,
        abogados: action.payload,
      };
    case DELETE_CLIENTE:
      return {
        ...state,
        clientes: action.payload,
      };

          case DELETE_PROSPECTO:
      return {
        ...state,
        prospectos: action.payload,
      };
    case DELETE_CONSULTA:
      return {
        ...state,
        consulta: action.payload,
      };
    case GET_TIPOSDECASOS:
      return {
        ...state,
        tiposDeCasos: action.payload,
      };
    case GET_CASOS:
      return {
        ...state,
        casos: action.payload,
      };
    case GET_CASOS_TODOS:
      return {
        ...state,
        pages: action.payload,
      };
    case FILTER_CASOS:
      return {
        ...state,
        casos: action.payload,
      };
    case ORDER_CASOS:
      return {
        ...state,
        casos: action.payload,
      };
    case GET_CASO_BY_ID:
      return {
        ...state,
        caso: action.payload,
      };
    case DELETE_CASO:
      return {
        ...state,
        casos: action.payload,
      };
    case FIN_CASO:
      return {
        ...state,
        casos: action.payload,
      };
    case POST_CITA:
      return {
        ...state,
        citas: action.payload,
      };
    case GET_CITAS:
      return {
        ...state,
        citas: action.payload,
      };
    case FILTER_CITAS:
      return {
        ...state,
        citas: action.payload,
      };
    case POST_CONSULTA:
      return {
        ...state,
        consultas: action.payload,
      };
    case GET_CONSULTAS:
      return {
        ...state,
        consultas: action.payload,
      };
    case GET_CONSULTAS_TODOS:
      return {
        ...state,
        pages: action.payload,
      };
    case MODIFICAR_DATOS:
      return {
        ...state,
        cliente: action.payload,
      };
    case MODIFICAR_CASO:
      return {
        ...state,
        caso: action.payload,
      };
    case MODIFICAR_CASO_COTIZACION:
      return {
        ...state,
        caso: action.payload,
      };
    case MODIFICAR_DATOS_ABOGADO:
      return {
        ...state,
        abogado: action.payload,
      };
    case GET_PAGOS:
      return {
        ...state,
        pagos: action.payload,
      };
    case POST_INSOLVENCIA:
      return {
        ...state,
        insolvencia: action.payload,
      };
    case GET_SOLICITUD_BY_CEDULA:
      return {
        ...state,
        solicitud: action.payload,
      };
    case CREAR_DEUDAS:
      return {
        ...state,
        deudas: action.payload,
      };

    case CLEAN_USER:
      return initialState;

    // case ADD_REVIEW:
    //   return {
    //     ...state,
    //     reviews: [...state.reviews, action.payload],
    //     reviewError: "",
    //   };
    // case FETCH_REVIEWS_SUCCESS:
    //   return {
    //     ...state,
    //     reviews: action.payload,
    //     reviewError: "",
    //   };
    // case FETCH_REVIEWS_FAILURE:
    // case ADD_REVIEW_FAILURE:
    //   return {
    //     ...state,
    //     reviewError: action.payload,
    //   };
    // case FETCH_REVIEWS_ALL:
    //   return {
    //     ...state,
    //     pages: action.payload,
    //   };

    default:
      return state;
  }
};

export default rootReducer;
