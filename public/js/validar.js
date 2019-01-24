$(document).ready(function() {
  $("#clave2").keyup(function() {
    var clave = $('#clave').val();
    var clave2 = $('#clave2').val();

    if (clave == clave2) {
      $('#error2').text("Las contraceñas coinciden!").css("color","green");
    }
    else{
      $('#error2').text("Las contraceñas no Coinciden!").css("color","red");

    }

  });

});


function validar() {
  var celular, expresion;
  celular = document.getElementById("celular").value;

  if (celular === ""){
    alert("Introdusca un numero de celular ");
    return false;
  }else if(celular.length < 8  ){
      alert("Por favor introdusca un numero de celular valido mas de 7");
      return false;

  }else if(isNaN(celular)){
      alert("introdusca un numero de celular valido");
      return false;

  }

}
