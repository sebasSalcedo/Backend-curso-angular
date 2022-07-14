'use strict'

const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async ( req, res = response) =>{
    const medicos = await Medico.find()
                                   .populate('hospital','nombre')
                                   .populate('usuario','nombre')
    
    res.json({

        ok: true,
        medicos
    })
}


const crearMedico = async ( req, res = response) =>{

    const id = req._id;
    const medico = new Medico( {
        
        usuario: id,
        ...req.body} );


    try {

       const saveMedico = await medico.save();

     

        return res.status(400).json({

            ok:false,
            saveMedico

        })
        
    } catch (error) {
        
        console.log(error);

        return res.status(500).json({

            ok:false,
            msg:'Comunicate con el administrador'

        })
    }

}


const actualizarMedico = async ( req, res = response) =>{

    const id = req.params.id;
    const user = req._id;
  

    try {
    const medico = await Medico.findById(id);

    if (!medico) {
        return res.status(500).json({
          ok: false,
          msg: "Medico no encontrado",
        });
      }

      const cambiosMedico = {
        ...req.body,
        usuario: user,
      };


      const medicoActualizado = await Medico.findByIdAndUpdate(
        id,
        cambiosMedico,
        { new: true }
      );
  
      return res.status(200).json({
        ok: true,
        msg: "Hospital actualizado",
        medicoActualizado,
      });
        
    } catch (error) {
        console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
    }



}

const borrarMedico = async ( req, res = response) =>{

    const id = req.params.id;
    
    try {
    const medicoDB = await Medico.findById(id);

    if (!medicoDB) {
        return res.status(404).json({
          ok: false,
          msg: "No se encontro un registro con ese id",
        });
      }

      const eliminarMedico = await Medico.findByIdAndDelete( id );

      return res.status(200).json({
        ok: true,
        msg: "Medico eliminado",
        eliminarMedico
      });

        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
          ok: false,
          msg: "Error inesperado",
        });
    }



}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}