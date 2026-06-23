import { syncData } from './src/utils/cloudEngine.js';

console.log("=== APP INICIADA ===");
console.log("Renderizando un BOTÓN ENORME en pantalla...");

syncData()
  .then(() => console.log("Éxito: Datos sincronizados"))
  .catch(() => console.log("Error: Falló la sincronización"));