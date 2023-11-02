const nameTextBox = document.querySelector("#nombre")
const emailTextBox = document.querySelector("#email")
const phoneTextBox = document.querySelector("#telefono")
const enterpriseTextBox = document.querySelector("#empresa")
const addClientButton = document.querySelector(".mt-5")
const clientObj ={
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
}
const validate = (e) =>{
    if (e.target.id === "email"){
        if (!validateEmail(e.target.value)){
            showError(`The email introduced it's not valid`, e.target.parentElement)
            clientObj[e.target.id] = ""
        }else {
            cleanseAlert(e.target.parentElement)
            clientObj[e.target.id] = e.target.value
        }
    }else if (e.target.id === "telefono"){
        if (!validatePhoneNumb(e.target.value)){
            showError(`The phone number introduced it's not valid`, e.target.parentElement)
            clientObj[e.target.id] = ""
        }else {
            cleanseAlert(e.target.parentElement)
            clientObj[e.target.id] = e.target.value
        }
    }else if (e.target.value.trim() === ""){
        showError(`The field ${e.target.id} is mandatory`, e.target.parentElement)
        clientObj[e.target.id] = ""
    }else {
        cleanseAlert(e.target.parentElement)
        clientObj[e.target.id] = e.target.value
    }
    enableAddClientButton()
}

nameTextBox.addEventListener("blur", validate)
emailTextBox.addEventListener("blur", validate)
phoneTextBox.addEventListener("blur", validate)
enterpriseTextBox.addEventListener("blur", validate)
addClientButton.addEventListener("click" , (e) =>{
    e.preventDefault()
})
const validateEmail = (emailToValidate) =>{
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
    if (emailToValidate.match(emailRegex)){
        return true
    }else {
        return false
    }
}
const validatePhoneNumb = (phoneNumbToValidate) =>{
    const phoneNumbRegex = /^\d{9}$/
    if (phoneNumbToValidate.match(phoneNumbRegex)){
        return true
    }else {
        return false
    }
}
const showError = (errorMsg, reference) =>{
    cleanseAlert(reference)
    const error = document.createElement("P")
    error.textContent = errorMsg
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    reference.appendChild(error)
}

const cleanseAlert = (reference) =>{
    const alert = reference.querySelector(".bg-red-600")
    if(alert){
        alert.remove()
    }
}
const enableAddClientButton = (qualifiedName, value) =>{
    if (clientObj.nombre !== "" && clientObj.email !== "" && clientObj.telefono !== "" && clientObj.empresa !== ""){
        addClientButton.removeAttribute("disabled")
        addClientButton.classList.remove('opacity-50')
    }else {
        addClientButton.setAttribute("disabled", value)
        addClientButton.classList.add('opacity-50')
    }
}