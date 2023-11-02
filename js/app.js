const clientsTable = document.querySelector("#listado-clientes")
const showAllClientsFromDB = () => {
    const dbName = "ClientDB"
    const request = window.indexedDB.open(dbName, 1)

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
    })
}
document.addEventListener("DOMContentLoaded", showAllClientsFromDB)