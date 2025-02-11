import { response, request } from "express";
import { hash, verify} from "argon2";
import argon2 from "argon2";
import User from './user.model.js';
 
export const getUsers = async (req = request, res = response) => {
    try {
        const {limite = 10, desde = 0} = req.query;
        const query = {estado : true};
 
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])
 
        res.status(200).json({
            succes: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUsersById = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                succes: false,
                msg: "Usuario not found"
            })
        }

        res.status(200).json({
            succes: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: "Error al obtener Usuario",
            error
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, email, password, oldPassword, ...data } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (password) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    msg: "Debes ingresar la contraseña anterior"
                });
            }

            const validPassword = await argon2.verify(user.password, oldPassword);
            if (!validPassword) {
                return res.status(400).json({
                    success: false,
                    msg: "La contraseña anterior es incorrecta"
                });
            }

            data.password = await argon2.hash(password);
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);

        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error: error.message || error 
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        
        const {id} = req.params;

        const user = await User.findByIdAndUpdate(id, {estado: false}, {new: true});

        const authenticatedUser = req.user;

        res.status(200).json({
            sucess: true,
            msg: "Usuario desactivado",
            user,
            authenticatedUser
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: "Error al desactivar usuario",
            error
        })
    }
}