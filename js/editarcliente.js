const nameTextBox = document.querySelector("#nombre")
const emailTextBox = document.querySelector("#email")
const phoneTextBox = document.querySelector("#telefono")
const enterpriseTextBox = document.querySelector("#empresa")
const saveChangesButton = document.querySelector(".mt-5")
const clientId = parseInt(localStorage.getItem("clientToEditId"))

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
    enableSaveChangesButton()
}

nameTextBox.addEventListener("blur", validate)
emailTextBox.addEventListener("blur", validate)
phoneTextBox.addEventListener("blur", validate)
enterpriseTextBox.addEventListener("blur", validate)
saveChangesButton.addEventListener("click" , (e) =>{
    e.preventDefault()
    updateClientData()
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
const enableSaveChangesButton = (qualifiedName, value) =>{
    if (clientObj.nombre !== "" && clientObj.email !== "" && clientObj.telefono !== "" && clientObj.empresa !== ""){
        saveChangesButton.removeAttribute("disabled")
        saveChangesButton.classList.remove('opacity-50')
    }else {
        saveChangesButton.setAttribute("disabled", value)
        saveChangesButton.classList.add('opacity-50')
    }
}
const getClientDataFromDB = () =>{
    const clientToEditObj ={
        nombre: "",
        email: "",
        telefono: "",
        empresa: ""
    }
    const request = indexedDB.open('ClientDB', 1)

    request.onerror = (e) => {
    console.log("Database error: " + e.target.errorCode)
    }

    request.onsuccess = (e) => {
        const db = e.target.result
        const transaction = db.transaction(['clients'], 'readonly')
        const objectStore = transaction.objectStore('clients')
        const getRequest = objectStore.get(clientId)

        getRequest.onsuccess = (e) => {
            const result = e.target.result
            clientToEditObj.nombre = result.nombre
            clientToEditObj.email = result.email
            clientToEditObj.telefono = result.telefono
            clientToEditObj.empresa = result.empresa
            putClientDataOnTextbox(clientToEditObj)
        }

        getRequest.onerror = (e) => {
            console.log('Error getting element:', e.target.error)
        }

    }
}

const putClientDataOnTextbox = (clientToEditObj) =>{
    nameTextBox.value = clientToEditObj.nombre
    emailTextBox.value = clientToEditObj.email
    phoneTextBox.value = clientToEditObj.telefono
    enterpriseTextBox.value = clientToEditObj.empresa
}

const updateClientData = () =>{
    const request = indexedDB.open('ClientDB')

    request.onerror = (e) => {
        console.log("Database error: " + e.target.errorCode)
    }

    request.onsuccess = (e) => {
        const db = e.target.result

        const transaction = db.transaction(['clients'], 'readwrite')
        const objectStore = transaction.objectStore('clients')

        const getRequest = objectStore.get(clientId)

        getRequest.onsuccess = () => {
            const result = getRequest.result
            result.nombre = clientObj.nombre
            result.email = clientObj.email
            result.telefono = clientObj.telefono
            result.empresa = clientObj.empresa

            const updateRequest = objectStore.put(result)

            updateRequest.onsuccess = function() {
                console.log("Record updated successfully")
            }

            updateRequest.onerror = (e) => {
                console.log("Error updating the record: " + e.target.errorCode)
            }
        }
    }

}

document.addEventListener("DOMContentLoaded", getClientDataFromDB)
