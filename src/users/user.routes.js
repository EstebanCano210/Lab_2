import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUsersById, updateUser , deleteUser} from "./user.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js"
import { existeUsuarioById } from "../helpers/db-validator.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();
 
router.get(
    "/",
    getUsers
);
 
router.get(
    "/findUser/:id",
    [   
        check("id", "No es un Id valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos 
    ],
    getUsersById
);

router.put(
    "/:id",
    uploadProfilePicture.single("profilePicture"),
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("password","La nueva contraseña debe tener al menos 8 caracteres").optional().isLength({ min: 8 }),
        check("oldPassword","Debes ingresar la contraseña anterior para cambiar la contraseña").if(check("password").exists()).notEmpty(),
        validarCampos
    ],
    updateUser
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;