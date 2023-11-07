## **Indexed DB cheatsheet**

##### Erik López Jiménez

### Abrir una BD con sus handlers

````javascript
let openRequest = indexedDB.open("store", 1);

openRequest.onupgradeneeded = function() {
  // se dispara si el cliente no tiene la base de datos
  // ...ejecuta la inicialización...
};

openRequest.onerror = function() {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function() {
  let db = openRequest.result;
  // continúa trabajando con la base de datos usando el objeto db si la conexión es exitosa
};
````

### Tipos de transacciones

readonly – solo lectura (predeterminado).
readwrite – puede leer-escribir.

### Crear o actualizar BD

````javascript
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Crea un ObkectStore para esta nueva BD
  const objectStore = db.createObjectStore("name", { keyPath: "myKey" });
};
````

### Añadir un dato

````javascript
const transaction = db.transaction(['NombreObjectStore'], 'readwrite');
const objectStore = transaction.objectStore('NombreObjectStore');

const nuevoDato = { campo1: 'valor1', campo2: 'valor2' };
const request = objectStore.add(nuevoDato);

request.onsuccess = () => {
  console.log('Dato agregado correctamente');
};

request.onerror = () => {
  console.log('Error al agregar el dato');
};
````

### Obtener un dato mediante su clave primaria

````javascript
const transaction = db.transaction(['NombreObjectStore'], 'readonly');
const objectStore = transaction.objectStore('NombreObjectStore');

const request = objectStore.get(clavePrimaria);

request.onsuccess = () => {
  if (request.result) {
    console.log('Dato encontrado:', request.result);
  } else {
    console.log('Dato no encontrado');
  }
};

request.onerror = () => {
  console.log('Error al buscar el dato');
};
````

### Actualizar un dato

````javascript
const transaction = db.transaction(['NombreObjectStore'], 'readwrite');
const objectStore = transaction.objectStore('NombreObjectStore');

const request = objectStore.put(datoActualizado);

request.onsuccess = () => {
  console.log('Dato actualizado correctamente');
};

request.onerror = () => {
  console.log('Error al actualizar el dato');
};
````

### Borrar un dato

````javascript
const transaction = db.transaction(['NombreObjectStore'], 'readwrite');
const objectStore = transaction.objectStore('NombreObjectStore');

const request = objectStore.delete(clavePrimaria);

request.onsuccess = () => {
  console.log('Dato eliminado correctamente');
};

request.onerror = () => {
  console.log('Error al eliminar el dato');
};
````

### Bibliogrqafía

[JavaScript.info](https://es.javascript.info/indexeddb)

[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
