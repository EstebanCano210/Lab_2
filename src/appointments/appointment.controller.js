import Appointment from "./appointment.model.js";
import Pet from "../pet/pet.model.js";
import User from "../users/user.model.js";

export const createAppointment = async (req, res) => {
  try {
    const { adopter, pet, date, location } = req.body;

    const adopterExists = await User.findById(adopter);
        if (!adopterExists) {
            return res.status(404).json({ success: false, msg: "Adoptante no encontrado" });
        }

    const petExists = await Pet.findById(pet);
        if (!petExists) {
                return res.status(404).json({ success: false, msg: "Mascota no encontrada" });
        }

        const appointment = new Appointment({ adopter, pet, date, location });

        await appointment.save();

        res.status(201).json({
            success: true,
            msg: "Cita creada exitosamente",
            appointment,
        });
    } catch (error) {
            res.status(500).json({
            success: false,
            msg: "Error al crear la cita",
            error: error.message,
        });
    }
};
