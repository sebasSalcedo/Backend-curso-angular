"use strict";

const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarImg = (tabla,img) =>{

    const pathViejo = `./uploads/${tabla}/${img}`;

    if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);



}

const uploadImg = async (tabla, id, nombreArch) => {
  switch (tabla) {
    case "medicos":
      const medico = await Medico.findById(id);

      if (!medico) {
        console.log("Medico no existe");
        return false;
      }


      borrarImg(tabla, medico.img );

      medico.img = nombreArch;
      await medico.save();
      return true;

    case "hospitales":
        const hospital = await Hospital.findById(id);

        if (!hospital) {
          console.log("hospital no existe");
          return false;
        }
  
  
        borrarImg(tabla, hospital.img );
  
        hospital.img = nombreArch;
        await hospital.save();
        return true;
      
    case "usuarios":
        const usuario = await Usuario.findById(id);

        if (!usuario) {
          console.log("usuario no existe");
          return false;
          break;
        }
  
  
        borrarImg(tabla, usuario.img );
  
        usuario.img = nombreArch;
        await usuario.save();
        return true;

  }
};

module.exports = {
  uploadImg,
};
