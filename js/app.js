const clientsTable = document.querySelector("#listado-clientes")
const showAllClientsFromDB = () => {
    const dbName = "ClientDB"
    const request = window.indexedDB.open(dbName, 1)

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
        const transaction = db.transaction("clients", "readonly")
        const objectStore = transaction.objectStore("clients")
        const getRequest = objectStore.getAll()

        getRequest.onsuccess = () => {
            const clients = getRequest.result
            insertClientsIntoPage(clients)
        }

        getRequest.onerror = (error) => {
            console.error("Error fetching clients:", error)
        }
    }

    request.onerror = (error) => {
        console.error("Error opening database: ", error)
    }
}
const insertClientsIntoPage = (clients) => {
    clients.forEach(client => {
        const newRow = clientsTable.insertRow()
        const nameCell = newRow.insertCell(0)
        const phoneCell = newRow.insertCell(1)
        const enterpriseCell = newRow.insertCell(2)
        const actionsCell = newRow.insertCell(3)

        nameCell.textContent = client.nombre
        phoneCell.textContent = client.telefono
        enterpriseCell.textContent = client.empresa

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "borrar cliente"
        deleteButton.classList.add("delete-button", "bg-red-500", "hover:bg-red-600", "font-bold","px-2", "rounded-full")

        const editClientLink = document.createElement("a")
        editClientLink.href = "./editar-cliente.html"

        const editButton = document.createElement("button")
        editButton.textContent = "editar cliente"
        editButton.classList.add("edit-button", "bg-green-500", "hover:bg-green-500", "font-bold","px-2", "rounded-full")
        editClientLink.appendChild(editButton)
        editButton.addEventListener("click", () =>{
            localStorage.setItem("clientToEditId", client.id)
        })

        deleteButton.addEventListener("click", () => {
            newRow.remove()
            deleteClientFromDB(client.id)
        })

        actionsCell.appendChild(deleteButton)
        actionsCell.appendChild(editClientLink)
    })
}

const deleteClientFromDB = (clientId) => {
    const dbName = "ClientDB"
    const request = indexedDB.open(dbName, 1)

    request.onsuccess = (e) => {
        const db = e.target.result
        const transaction = db.transaction("clients", "readwrite")
        const objectStore = transaction.objectStore("clients")
        const deleteRequest = objectStore.delete(clientId)
        deleteRequest.onsuccess = () => {
            console.log("Cliente eliminado de IndexedDB")
        }

        deleteRequest.onerror = (error) => {
            console.error("Error al borrar el cliente de IndexedDB:", error)
        }
    }
    request.onerror = (error) => {
        console.error("Error opening database: ", error)
    }
}
document.addEventListener("DOMContentLoaded", showAllClientsFromDB)
