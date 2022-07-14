"use strict";

const { response } = require("express");

const Hospital = require("../models/hospital");

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre");

  res.json({
    ok: true,
    hospitales,
  });
};

const crearHospital = async (req, res = response) => {
  const id = req._id;
  const hospital = new Hospital({
    usuario: id,
    ...req.body,
  });

  try {
    const saveHospital = await hospital.save();

    return res.status(400).json({
      ok: false,
      saveHospital,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      ok: false,
      msg: "Comunicate con el administrador",
    });
  }
};

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const user = req._id;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(500).json({
        ok: false,
        msg: "Hospital no encontrado",
      });
    }

    const cambiosHospital = {
      ...req.body,
      usuario: user,
    };

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      msg: "Hospital actualizado",
      hospitalActualizado,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};



const borrarHospital = async (req, res = response) => {

    const id = req.params.id;

    try {
    const hospitalDB = await Hospital.findById(id);

    if (!hospitalDB) {
        return res.status(404).json({
          ok: false,
          msg: "No se encontro un registro con ese id",
        });
      }
  
      const deleteHospital = await Hospital.findByIdAndDelete( id );

      return res.status(200).json({
        ok: true,
        msg: "Hospital eliminado",
        deleteHospital
      });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
          ok: false,
          msg: "Error inesperado",
        });
    }


};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
