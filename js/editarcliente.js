import {validate} from "js/app.js"

const newClientFunctions = require('./archivo1');
const nameTextBox = document.querySelector("#nombre")
const emailTextBox = document.querySelector("#email")
const phoneTextBox = document.querySelector("#telefono")
const enterpriseTextBox = document.querySelector("#empresa")
const saveChangesButton = document.querySelector(".mt-5")

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
        const clientId = parseInt(localStorage.getItem("clientToEditId"))
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
    nameTextBox.placeholder = clientToEditObj.nombre
    emailTextBox.placeholder = clientToEditObj.email
    phoneTextBox.placeholder = clientToEditObj.telefono
    enterpriseTextBox.placeholder = clientToEditObj.empresa
}

document.addEventListener("DOMContentLoaded", getClientDataFromDB)
