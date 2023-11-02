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
const enableAddClientButton = (qualifiedName, value) =>{
    if (clientObj.nombre !== "" && clientObj.email !== "" && clientObj.telefono !== "" && clientObj.empresa !== ""){
        addClientButton.removeAttribute("disabled")
        addClientButton.classList.remove('opacity-50')
    }else {
        addClientButton.setAttribute("disabled", value)
        addClientButton.classList.add('opacity-50')
    }
}
// Function to add a new client to IndexedDB
const addClientToDB = (clientObj) => {
    const request = window.indexedDB.open("ClientDB", 1)

    request.onupgradeneeded = (e) => {
        const db = e.target.result
        const objectStore = db.createObjectStore("clients", { keyPath: "id", autoIncrement: true })
        objectStore.createIndex("nombre", "nombre", { unique: false })
        objectStore.createIndex("email", "email", { unique: true })
        objectStore.createIndex("telefono", "telefono", { unique: false })
        objectStore.createIndex("empresa", "empresa", { unique: false })
    }

    request.onsuccess = (e) => {
        const db = e.target.result
        const transaction = db.transaction("clients", "readwrite")
        const objectStore = transaction.objectStore("clients")

        // Add the client object to the database
        const addRequest = objectStore.add(clientObj)

        addRequest.onsuccess = function () {
            console.log("Client added to the database")
        }

        addRequest.onerror = function (error) {
            console.error("Error adding client: ", error)
        }
    }

    request.onerror = function (error) {
        console.error("Error opening database: ", error)
    }
}
