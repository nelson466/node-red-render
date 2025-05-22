// inject-creds.js
// Este script genera/actualiza flows_cred.json para tus nodos Google Sheets
const fs = require('fs');
const path = require('path');
// 1. Leer el JSON de credenciales desde la variable de entorno
const raw = process.env.GSHEET_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.warn('Advertencia: GSHEET_SERVICE_ACCOUNT_JSON no definida.');
  process.exit(0);
}
let creds;
try {
  creds = JSON.parse(raw);
} catch (err) {
  console.warn('GSHEET_SERVICE_ACCOUNT_JSON no es un JSON válido:', err.message);
  process.exit(0);
}
// 2. IDs de credenciales usados por tus nodos GSheet (campo "creds" en flows.json)
const CRED_IDS = [
  '3d0e07754521693a', // nodo 057f0d931ddff8f7
  '3d0e07754521693a', // nodo e7534f9ecc49c258
  '3d0e07754521693a'  // nodo c3f645121877dab0
];
// 3. Construir objeto para flows_cred.json
globalThis.flowsCred = {};
CRED_IDS.forEach(id => {
  globalThis.flowsCred[id] = creds;
});
// 4. Escribir flows_cred.json en la raíz
try {
  const outPath = path.join(__dirname, 'flows_cred.json');
  fs.writeFileSync(outPath, JSON.stringify(globalThis.flowsCred, null, 2));
  console.log('flows_cred.json generado con IDs:', CRED_IDS.join(', '));
} catch (err) {
  console.warn('Error al escribir flows_cred.json:', err.message);
}
process.exit(0);
