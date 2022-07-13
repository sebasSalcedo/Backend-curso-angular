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


const actualizarMedico = ( req, res = response) =>{

    res.json({

        ok: true,
        msg:'actualizarMedico'

    })

}

const borrarMedico = ( req, res = response) =>{

    res.json({

        ok: true,
        msg:'borrarHospital'

    })

}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}