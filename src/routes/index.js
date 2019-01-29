const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const REgUSER = require('../models/regUser');

router.get('/', (req, res) => {
  res.render('index');
});

// servicio para cambiar de pestaña
router.get('/regUSer', (req, res) => {
  res.render('regUSer');
});

//servicio para guardar en REgUSER
// router.post('/addUser1', async (req, res) => {
//   const reguser = new regU(req.body);
//   await reguser.save();
//   console.log(reguser);
//   res.render('regUSer');
//
// });
//servicio para guardar en REgUSER
router.post("/addUser", async(req, res) => {
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
  var user = new REgUSER(reg_user);
  if(reg_user.clave == reg_user.clave2){
    console.log(reg_user.clave2, reg_user.clave);

    REgUSER.find({email: req.body.email}).exec( async (err, docs) => {
      console.log(docs);
        if(docs != ""){
          console.log('ya existe ese email')
          res.status(400).json({
                  "msn" : "ya existe ese email"
                });
          // res.send("ya existe ese email")
        }
        else{
            await user.save();
            console.log('enviado');
            res.status(200).json({
                    "msn" : "enviado"
                  });
            // res.send('se enviaron los datos')
        }

    });
  }
  else{
    console.log('las claves no son iguales');
    res.status(400).json({
            "msn" : "claves diferentes"
          });
    //res.send('las claves no son iguales');
    // res.render('regUSer');
  }
});

// servicio para mostrar todos usuarios
router.get("/getUser", async(req, res) => {
  const verU = await REgUSER.find();
  res.render('mostrarUser',{
    verU
  });
});

// servicio para eliminar usuarios
router.get('/delUser/:id', async (req, res) => {
  const {id} = req.params;
  await REgUSER.deleteOne({_id: id});
  res.redirect('/getUser');

});

//sericio para cambiar el estado de un usuario
router.get('/turn/:id', async (req, res) =>{
  const {id} = req.params; // esto recive el id que nos envia el navegador
  const task = await REgUSER.findById(id); // busca el id en la base de datos
  task.status = !task.status;
  await task.save(); // esto guarda donde la vase de datos
  res.redirect('/getUser');

});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<
// servicios con fetch

//servicio para guardar en REgUSER
router.post("/userReg", (req, res) => {
  var regU = {
    nombre: req.body.nombre,
    apellidoP: req.body.apellidoP,
    apellidoM: req.body.apellidoM,
    email: req.body.email,
    clave: req.body.clave,
    clave2: req.body.clave2,
    celular: req.body.celular,
    direccion: req.body.direccion
  };
  var userData = new REgUSER(regU);
  console.log(userData);
  userData.save().then( () => {
      res.status(200).json({
        "msn" : "Registrado con exito"
      });
  });

});



module.exports = router;
