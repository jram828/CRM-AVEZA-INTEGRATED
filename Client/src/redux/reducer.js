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
  GET_CAMPAIGNS,
  GET_CAMPAIGNS_TODOS,
  GET_CLIENTES,
  GET_CLIENTES_CASOS,
  GET_CLIENTES_TODOS,
  GET_PROSPECTOS,
  GET_PROSPECTOS_CASOS,
  GET_PROSPECTOS_TODOS,
  GET_BY_ID_ABOGADO,
  GET_BY_ID_CLIENTE,
  GET_BY_ID_PROSPECTO,
  GET_BY_ID_CAMPAIGN,
  FILTER_ABOGADO,
  FILTER_CLIENTE,
  FILTER_PROSPECTO,
  SET_SOURCE,
  ORDER_ABOGADOS,
  ORDER_CLIENTES,
  ORDER_PROSPECTOS,
  DELETE_ABOGADO,
  DELETE_CAMPAIGN,
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
  GET_CITAS_BY_ID,
  GET_CITAS_CALENDAR,
  GET_TAREAS,
  GET_TAREAS_BY_ID,
  POST_NOTA,
  GET_NOTAS,
  GET_NOTAS_BY_ID,
  PATCH_NOTA,
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
  MODIFICAR_DATOS_CAMPAIGN,
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
  COPIAR_DEUDAS,
  PUT_DATOS_COTIZACION,
  POST_HONORARIOS,
  COPIAR_HONORARIOS,
  CREAR_ACREEDOR,
  GET_ACREEDORES,
  GET_DISPONIBILIDAD,
  PUT_STATUS,
  POST_TAREA,
  PATCH_TAREA,
  PATCH_CITA,
} from "./actions";

let initialState = {
  usuario: {},
  isAuthenticated: false,
  user: {},
  abogados: [],
  campaigns: [],  
  clientes: [],
  prospectos: [],
  abogado: {},
  campaign: {},
  cliente: {},
  prospecto: {},
  honorarios: {},
  tiposDeCasos: [],
  casos: [],
  caso: {},
  cita: [],
  tarea: [],
  citas: [],
  citasCalendar: [],
  tareas: [],
  citasDetail: [],
  tareasDetail: [],
  notasDetail: [],
  nota: {},
  deudas: [],
  filtro: [],
  consultas: [],
  pagos: [],
  source: "cliente",
  reviews: [],
  pages: [],
  insolvencia: [],
  horasDisponibles: [],
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
    case GET_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.payload,
      };
    case GET_CAMPAIGNS_TODOS:
      return {
        ...state,
        campaigns: action.payload,
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
      return {
        ...state,
        abogados: action.payload,
      };
    case GET_BY_ID_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
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
    case DELETE_CAMPAIGN:
      return {
        ...state,
        campaigns: action.payload,
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
        cita: action.payload,
      };
    case GET_CITAS:
      return {
        ...state,
        citas: action.payload.datosPagina,
      };
    case GET_CITAS_BY_ID:
      return {
        ...state,
        citasDetail: action.payload,
      };
    case POST_TAREA:
      return {
        ...state,
        tarea: action.payload,
      };
    case GET_TAREAS:
      return {
        ...state,
        tareas: action.payload.datosPagina,
      };
    case PATCH_TAREA:
      return {
        ...state,
        tarea: action.payload,
      };
    case POST_NOTA:
      return {
        ...state,
        nota: action.payload,
      };
    case GET_NOTAS:
      return {
        ...state,
        notasDetail: action.payload.datosPagina,
      };
    case GET_NOTAS_BY_ID:
      return {
        ...state,
        notasDetail: action.payload,
      };
    case PATCH_NOTA:
      return {
        ...state,
        nota: action.payload,
      };
    case PATCH_CITA:
      return {
        ...state,
        cita: action.payload,
      };
    case GET_TAREAS_BY_ID:
      return {
        ...state,
        tareasDetail: action.payload,
      };
    case GET_CITAS_CALENDAR:
      return {
        ...state,
        citasCalendar: action.payload,
      };
    case GET_DISPONIBILIDAD:
      return {
        ...state,
        horasDisponibles: action.payload,
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
    case MODIFICAR_DATOS_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
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
    case COPIAR_DEUDAS:
      return {
        ...state,
        deudas: action.payload,
      };
    case PUT_DATOS_COTIZACION:
      return {
        ...state,
        prospecto: action.payload,
      };
    case PUT_STATUS:
      return {
        ...state,
        prospecto: action.payload,
      };
    case POST_HONORARIOS:
      return {
        ...state,
        honorarios: action.payload,
      };
    case COPIAR_HONORARIOS:
      return {
        ...state,
        honorarios: action.payload,
      };
    case CREAR_ACREEDOR:
      return {
        ...state,
        acreedor: action.payload,
      };
    case GET_ACREEDORES:
      return {
        ...state,
        listaacreedores: action.payload,
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
