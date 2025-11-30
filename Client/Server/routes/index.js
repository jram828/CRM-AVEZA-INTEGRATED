import { Router } from "express";
import abogadosRouter from "./abogadosRoutes.js";
import clientesRoutes from "./clienteRoutes.js";
import prospectosRoutes from "./prospectoRoutes.js";
import consultaRouter from "./consultaRoutes.js";
import tipoDeCasosRouter from "./tipoDeCasosRoutes.js";
import casosRouter from "./casosRoutes.js";
import loginRouter from "./loginRoute.js";
import usuariosRouter from "./usuariosRoutes.js";
import citasRouter from "./citasRoutes.js";
import tareasRouter from "./tareasRoutes.js";
import paymentsRouter from "./../routes/paymentsRoutes.js";
import pagosClientesRouter from "./pagosClienteRoutes.js";
import insolvenciaRouter from "./insolvenciaRoutes.js";
import uploadRouter from "./uploadRoutes.js";
import acreedorRouter from "./acreedorRoutes.js";
import dbbackupRouter from "./dbbackupRoutes.js";
// import reviewsRouter from "./reviewsRoutes.js";
// import dashboardRouter from './dashboardRoutes.js'

const router = Router();

router.use("/abogados", abogadosRouter);
router.use("/clientes", clientesRoutes);
router.use("/prospectos", prospectosRoutes);
router.use("/consultas", consultaRouter);
router.use("/tiposdecasos", tipoDeCasosRouter);
router.use("/casos", casosRouter);
router.use("/login", loginRouter);
router.use("/usuarios", usuariosRouter);
router.use("/citas", citasRouter);
router.use("/tareas", tareasRouter);
router.use("/pagos", paymentsRouter);
router.use("/insolvencia", insolvenciaRouter);
router.use("/pagosClientes", pagosClientesRouter);
router.use("/storefile", uploadRouter);
router.use("/acreedores", acreedorRouter);
router.use("/dbbackup", dbbackupRouter);
// router.use("/reviews", reviewsRouter);
// router.use("/dashboard", dashboardRouter)

export default router;
