const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const request = require('request');

const REgUSER = require('../models/regUser');
const TASK = require('../models/task');
const TASK1 = require('../models/task1');

router.get('/', (req, res) => {
  res.render('index');
});

// servicio para cambiar de pestaña
router.get('/regUSer', (req, res) => {
  res.render('regUSer');
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<

  router.post('/addUser2', async (req, res, err) => {
    if(err){
      res.status(400).json({
        'msn' : err
      });
    }else{
      const task1 = new TASK1(req.body);
      await task1.save();
      console.log(task1);
      res.status(200).json({
          'msn' : task1
       });
    }
});
//>>>>>>>>>>>ZZZ
router.get("/getP1", async(req, res) => {
  const ver = await TASK1.find();
  res.status(200).json(ver);
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//servicio para guardar en REgUSER
router.post('/addUser1', async (req, res) => {
  const task = new TASK(req.body);
  await task.save();
  console.log(task);
  res.status(200).json({
      'msn' : task
   });

});

router.get("/getP", async(req, res) => {
  const verU = await TASK.find();
  res.status(200).json(verU);
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//servicio para guardar en REgUSER
// router.post("/addUser", async(req, res) => {
//   var reg_user = {
//     nombre: req.body.nombre,
//     apellidoP: req.body.apellidoP,
//     apellidoM: req.body.apellidoM,
//     email: req.body.email,
//     clave: req.body.clave,
//     clave2: req.body.clave2,
//     celular: req.body.celular,
//     direccion: req.body.direccion
//
//   };
//   var user = new REgUSER(reg_user);
//   if(reg_user.clave == reg_user.clave2){
//     console.log(reg_user.clave2, reg_user.clave);
//
//     REgUSER.find({email: req.body.email}).exec( async (err, docs) => {
//       console.log(docs);
//         if(docs != ""){
//           console.log('ya existe ese email')
//           res.status(400).json({
//                   "msn" : "ya existe ese email"
//                 });
//           // res.send("ya existe ese email")
//         }
//         else{
//             if(reg_user.nombre == ""){
//               res.status(400).json({
//                 'msn' : 'Introdusca un nombre'
//               });
//             }else
//             if(reg_user.apellidoP==""){
//               res.status(400).json({
//                 'msn' : 'Introdusca su apellido paterno'
//               });
//             }else{
//               await user.save();
//               console.log('enviado');
//               res.status(200).json({
//                 "msn": "enviado"
//               });
//             }
//
//             // res.send('se enviaron los datos')
//         }
//
//     });
//   }
//   else{
//     console.log('las claves no son iguales');
//     res.status(400).json({
//             "msn" : "claves diferentes"
//           });
//     //res.send('las claves no son iguales');
//     // res.render('regUSer');
//   }
// });

// servicio para mostrar todos usuarios
router.get("/getUser", async(req, res) => {
  const verU = await REgUSER.find();
  res.render('mostrarUser',{
    verU
  });
});
//mostrar todos los usuarios en formato json
router.get("/usersGET", (req, res, next) =>{
  REgUSER.find({}).exec( (error, docs) => {
      res.status(200).json(docs);
  })
});

// servicio para eliminar usuarios
router.get('/delUser/:id', async (req, res) => {
  const {id} = req.params;
  await REgUSER.deleteOne({_id: id});
  res.status(200).json({
    "msn": "Eliminado"
  });

});

//sericio para cambiar el estado de un usuario
router.get('/turn/:id', async (req, res) =>{
  const {id} = req.params; // esto recive el id que nos envia el navegador
  const task = await REgUSER.findById(id); // busca el id en la base de datos
  task.status = !task.status;
  await task.save(); // esto guarda donde la vase de datos
  res.status(200).json({
          "msn" : "se cambio el estado"
        });

});

//servicio para login
router.post('/sessions', function (req, res) {

  REgUSER.find({email:req.body.email, clave:req.body.clave, },function(err, docs){
    if(docs != ""){
      console.log("Hola " + docs[0].nombre + "!");
      res.status(200).json({
              "msn" : "Hola " + docs[0].nombre + "!"
            });
    }else{
      console.log("Usted no esta registrado");
      res.status(400).json({
              "msn" : "Usted no esta registrado"
            });
    }
  });
});

//para reCAPTCHA y envio de datos
router.post('/reCAPTCHA', async(req, res) => {
  var reg_user = {
    nombre: req.body.nombre,
    apellidoP: req.body.apellidoP,
    apellidoM: req.body.apellidoM,
    email: req.body.email,
    clave: req.body.clave,
    clave2: req.body.clave2,
    celular: req.body.celular,
    direccion: req.body.direccion
  };
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msn": "Please select captcha"});
  }
  // secret key
  const secretKey = '6LdxcI8UAAAAAJ-RuzN-uXXvvSLGlIoTOYJVQv_B';

  //Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Verificando URL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    // If Not Successful
    if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msn":"Failed captcha verification"});
    }

    var user = new REgUSER(reg_user);
    if(reg_user.clave == reg_user.clave2){
      console.log(reg_user.clave2, reg_user.clave);

      REgUSER.find({email: req.body.email}).exec( async (err, docs) => {
        console.log(docs);
          if(docs != ""){
            console.log('ya existe ese email')
            res.status(400).json({
                    "msn" : "Ese email ya esta en uso. Prueba con otro"
                  });
            // res.send("ya existe ese email")
          }
          else{
              if(reg_user.nombre == ""){
                res.status(400).json({
                  'msn' : 'Introduzca un nombre'
                });
              }else
              if(reg_user.apellidoP==""){
                res.status(400).json({
                  'msn' : 'Introduzca su apellido paterno'
                });
              }else
                if(reg_user.clave.length < 6 ){
                  res.status(400).json({
                    'msn' : 'Las contraseñas deben tener al menos 6 caracteres'
                  });

                }else
                if(reg_user.celular.length <7){
                  res.status(400).json({
                    'msn' : 'Introduzca un numero de celular válido mas de 7 digitos'
                  });
                }else
                if(reg_user.email == ""){
                  res.status(400).json({
                    'msn' : 'La dirección de correo electrónico es obligatoria.'
                  });
                }else
                if(isNaN(reg_user.celular)){
                  res.status(400).json({
                    'msn' : 'Introduzca un numero de celular válido.'
                  });
                }else{
                await user.save();
                console.log('enviado');
                res.status(200).json({
                  "msn": "enviado",
                  // "msn": true, "msg":"Captcha passed"
                });
              }

              // res.send('se enviaron los datos')
          }

      });
    }
    else{
      console.log('las claves no son iguales');
      res.status(400).json({
              "msn" : "Las contaceñas no son iguales"
            });
      //res.send('las claves no son iguales');
      // res.render('regUSer');
    }
    // return res.json({"success": true, "msg":"Captcha passed"});
  });

});

module.exports = router;
