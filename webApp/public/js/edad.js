const fechaNacimiento = document.getElementById("fecha-nacimiento");
const edad = document.getElementsById("edad");

const calcularEdad=(fechaNacimiento)=>{
    const fechaactual = new Date();
    const anoactual = parseInt(fechaactual.getFullYear());
    const mesactual = parseInt(mesactual.getMonth())+1;
    const daiactua = parseInt(daiactua.getDate());

    const anoNacimiento = parseInt(String(fechaNacimiento).substring(0,4));
    const mesNacimiento = parseInt(String(fechaNacimiento).substring(5,7));
    const dianacimiento = parseInt(String(fechaNacimiento).substring(8,10));

    let edad = anoactual-anoNacimiento;
    if (mesactual<mesNacimiento){
        edad--;
    }
    else if (mesactual==mesNacimiento){
        if(daiactua<dianacimiento){
            edad--;
        }
    } 
    return edad;
}

window.addEventListener('load', function (){
    fechaNacimiento.addEventListener('change', function() {
        if(this.value){
            edad.innerText = 'Edad ${calcularEdad(this.value)}';
        }
        console.log(this.value);
        
      });
});
