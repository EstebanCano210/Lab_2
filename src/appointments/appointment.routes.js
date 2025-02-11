import { Router } from "express";
import { check } from "express-validator";
import { createAppointment } from "./appointment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("adopter", "El ID del adoptante es obligatorio").isMongoId(),
    check("pet", "El ID de la mascota es obligatorio").isMongoId(),
    check("date", "La fecha es obligatoria y debe ser válida").isISO8601(),
    check("location", "La ubicación es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  createAppointment
);

export default router;
