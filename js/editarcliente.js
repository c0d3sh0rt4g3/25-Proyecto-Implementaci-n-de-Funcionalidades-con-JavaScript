import {openDB} from "./app.js";
import {validate} from "./nuevocliente.js";

const nameTextBox = document.querySelector("#nombre")
const emailTextBox = document.querySelector("#email")
const phoneTextBox = document.querySelector("#telefono")
const enterpriseTextBox = document.querySelector("#empresa")
const clientId = parseInt(localStorage.getItem("clientToEditId"))
const saveChangesButton = document.querySelector(".mt-5")
const clientObj ={
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
}

nameTextBox.addEventListener("blur", validate)
emailTextBox.addEventListener("blur", validate)
phoneTextBox.addEventListener("blur", validate)
enterpriseTextBox.addEventListener("blur", validate)
saveChangesButton.addEventListener("click" , (e) =>{
    e.preventDefault()
    updateClientData()
})
const getClientDataFromDB = () =>{
    const clientToEditObj ={
        nombre: "",
        email: "",
        telefono: "",
        empresa: ""
    }
    const request = openDB()

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
    const request = openDB()

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

            updateRequest.onsuccess = () => {
                console.log("Record updated successfully")
            }

            updateRequest.onerror = (e) => {
                console.log("Error updating the record: " + e.target.errorCode)
            }
        }
    }

}
document.addEventListener("DOMContentLoaded", getClientDataFromDB)
