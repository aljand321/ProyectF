const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regUserSchema = Schema ({

  nombre: String,
  apellidoP: String,
  apellidoM :String,
  email: String,
  clave: String,
  celular: Number,
  direccion : String,
  status: {
    type: Boolean,
    default: false
  }
});

regUserSchema.virtual("clave2").get(function(){
  return this.p_c;
}).set(function(clave){
  this.p_c = clave;
});

module.exports = mongoose.model('regUser', regUserSchema);
