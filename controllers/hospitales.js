'use strict'

const { response } = require('express');

const Hospital = require('../models/hospital')

const getHospitales = async( req, res = response) =>{

    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre')
                                     

        res.json({

            ok: true,
            hospitales

        })

}


const crearHospital = async ( req, res = response) =>{

    const id = req._id;
    const hospital = new Hospital( {
        
        usuario: id,
        ...req.body} );


    try {

       const saveHospital = await hospital.save();

     

        return res.status(400).json({

            ok:false,
            saveHospital

        })
        
    } catch (error) {
        
        console.log(error);

        return res.status(400).json({

            ok:false,
            msg:'Comunicate con el administrador'

        })
    }



}


const actualizarHospital = ( req, res = response) =>{

    res.json({

        ok: true,
        msg:'actualizarHospital'

    })

}

const borrarHospital = ( req, res = response) =>{

    res.json({

        ok: true,
        msg:'borrarHospital'

    })

}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}