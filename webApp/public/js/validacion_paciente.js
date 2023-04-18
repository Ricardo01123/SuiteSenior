let formulario = document.getElementById("form_paciente")
let expediente =document.getElementById("Expediente")
let nombre =document.getElementById("Nombre")
let telefono =document.getElementById("Telefono")

form.addEventListener("submit",e=>{
    e.preventDefault()
    let warnings =""
    let invalido=false
    alertas.innerHTML=""
    let regex_nombre=/^[A-Za-z\sàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{5,25}$/gm
    let rgex_expediente=/^[A-Z]{4}-[0-9]{6}/gm
    if(!expediente){
        warnings+= 'Expediente invalido <br>'
        invalido=true
    }
    if(!regex_nombre.test(nombre.value)){
        warnings+= 'Nombre invalido <br>'
        invalido=true
    }


})