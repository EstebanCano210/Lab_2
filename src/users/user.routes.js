import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUsersById, updateUser , deleteUser} from "./user.controller.js";
import {validarCampos} from "../middlewares/validar-campos.js"
import { existeUsuarioById } from "../helpers/db-validator.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js"

const router = Router();
 
router.get("/", getUsers);
 
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
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;