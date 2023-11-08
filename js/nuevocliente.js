import {openDB} from "./app.js";

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
    const buttonToEnable = document.querySelector(".mt-5")
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
    enableButton(buttonToEnable)
}

nameTextBox.addEventListener("blur", validate)
emailTextBox.addEventListener("blur", validate)
phoneTextBox.addEventListener("blur", validate)
enterpriseTextBox.addEventListener("blur", validate)
addClientButton.addEventListener("click" , (e) =>{
    e.preventDefault()
    addClientToDB(clientObj)
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
const enableButton = (buttonToEnable, qualified, value) =>{
    if (clientObj.nombre !== "" && clientObj.email !== "" && clientObj.telefono !== "" && clientObj.empresa !== ""){
        buttonToEnable.removeAttribute("disabled")
        buttonToEnable.classList.remove('opacity-50')
    }else {
        buttonToEnable.setAttribute("disabled", value)
        buttonToEnable.classList.add('opacity-50')
    }
}
const addClientToDB = (clientObj) => {
    const request = openDB()

    request.onsuccess = (e) => {
        const db = e.target.result
        const transaction = db.transaction("clients", "readwrite")
        const objectStore = transaction.objectStore("clients")

        const addRequest = objectStore.add(clientObj)

        addRequest.onsuccess = () => {
            console.log("Client added to the database")
        }

        addRequest.onerror =  (error) => {
            console.error("Error adding client: ", error)
        }
    }

    request.onerror = (error) => {
        console.error("Error opening database: ", error)
    }
}

export {validate}