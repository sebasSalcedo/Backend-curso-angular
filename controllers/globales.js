"use strict";

const path = require('path')
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");
const { uploadImg } = require("../helpers/uploadImg");

const getBusquedaData = async (req, res = response) => {
  const dtBusqueda = req.params.busqueda;
  const regex = new RegExp(dtBusqueda, "i");

  const [usuarios, medicos, hospital] = await Promise.all([
    Usuario.find({
      nombre: regex,
    }),
    Medico.find({
      nombre: regex,
    }),

    Hospital.find({
      nombre: regex,
    }),
  ]);

  return res.status(200).json({
    ok: false,
    usuarios,
    medicos,
    hospital,
  });
};

const getDataGlobal = async (req, res = response) => {
  const dtTabla = req.params.tabla;
  const dtBusqueda = req.params.busqueda;
  let data = [];

  const regex = new RegExp(dtBusqueda, "i");

  switch (dtTabla) {
    case "medicos":
      data = await Medico.find({
        nombre: regex,
      })
        .populate("hospital", "nombre")
        .populate("usuario", "nombre");
      break;
    case "hospitales":
      data = await Hospital.find({
        nombre: regex,
      }).populate("usuario", "nombre");

      break;
    case "usuarios":
      data = await Usuario.find({
        nombre: regex,
      });

      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: " La tabla tiene que ser usuarios/medicos/hopitales",
      });
  }

  res.json({
    ok: true,
    resultado: data,
  });
};

const fileUpload = async (req, res = response) => {
  const { tabla, id } = req.params;

  const tiposValidos = ["hospitales", "medicos", "usuarios"];

  if (!tiposValidos.includes(tabla)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un tipo valido usuarios/medicos/hopitales",
    });
  }

  // Validar que exista un archivo

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      ok: false,
      msg: "Nop hay ningun archivo",
    });
  }

  // Procesar la Img

  const file = req.files.img;

  const nombreCortado = file.name.split(".");
  const extensionArch = nombreCortado[nombreCortado.length - 1];

  const extionesValidas = ["png", "jpg", "jpeg", "gif"];

  if (!extionesValidas.includes(extensionArch)) {
    return res.status(400).json({
      ok: false,
      msg: "Extension no permitida",
    });
  }

  // Generar el nombre del archivo

  const nombreArch = `${uuidv4()}.${extensionArch}`;

  // path para guardar la img

  const path = `./uploads/${tabla}/${nombreArch}`;

  // Mover la img
  file.mv(path, (err) => {
    if (err) {
  
      return res.status(500).send({
        ok: false,
        msg: "Error al mover la img",
      });
    }

    // Actualizar base de datos
  
    uploadImg( tabla, id,  nombreArch );

    return res.status(200).send({
      ok: true,
      msg: "Archivo Cargado",
      nombreArch,
    });
  });
};


const viewFileImg = async  (req, res = response) => {

  const { tipo, id } = req.params;
  let pathImg  = path.join( __dirname + `../../uploads/${ tipo }/${ id }`);


 
  if(!fs.existsSync(pathImg)){
   pathImg  = path.join( __dirname + `../../uploads/img/notFound.jpg`);

  
  }
  res.sendFile(path.resolve(pathImg))

}

module.exports = {
  getBusquedaData,
  getDataGlobal,
  fileUpload,
  viewFileImg,
};
