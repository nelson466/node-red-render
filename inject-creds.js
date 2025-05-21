// inject-creds.js
// Este script genera flows_cred.json a partir de la variable de entorno GSHEET_SERVICE_ACCOUNT_JSON
// y lo mapea a los tres nodos GSheet que usas en tu flujo.
const fs = require('fs');
// Asegúrate de haber definido esta variable en Render
const raw = process.env.GSHEET_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error('La variable GSHEET_SERVICE_ACCOUNT_JSON no está definida.');
  process.exit(1);
}
let creds;
try {
  creds = JSON.parse(raw);
} catch (err) {
  console.error('GSHEET_SERVICE_ACCOUNT_JSON no contiene un JSON válido:', err);
  process.exit(1);
}
// Lista de los IDs de credenciales que usa cada nodo GSheet en tu flows.json
// Asegúrate de que coincidan con el campo "creds" que tienes en cada nodo.
const CRED_IDS = [
  '057f0d931ddff8f7',
  'e7534f9ecc49c258',
  'c3f645121877dab0'
];
// Genera el objeto que irá a flows_cred.json
const flowsCred = {};
CRED_IDS.forEach(id => {
  flowsCred[id] = creds;
});
// Escribe (o sobreescribe) el archivo flows_cred.json en la raíz
try {
  fs.writeFileSync('flows_cred.json', JSON.stringify(flowsCred, null, 2));
  console.log(`flows_cred.json generado con IDs: ${CRED_IDS.join(', ')}`);
} catch (err) {
  console.error('Error al escribir flows_cred.json:', err);
  process.exit(1);
}
