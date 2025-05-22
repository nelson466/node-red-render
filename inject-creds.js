#!/usr/bin/env node
// inject-creds.js
// Inyecta el JSON de la cuenta de servicio directamente en flows.json
// para cada nodo GSheet que uses.
const fs = require('fs');
const path = require('path');
// 1) Lee la variable de entorno
const raw = process.env.GSHEET_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.warn('GSHEET_SERVICE_ACCOUNT_JSON no definida. No se inyectarán credenciales.');
  process.exit(0);
}
let creds;
try {
  creds = JSON.parse(raw);
} catch (err) {
  console.warn('GSHEET_SERVICE_ACCOUNT_JSON no es JSON válido:', err.message);
  process.exit(0);
}
// 2) Carga flows.json
const flowsPath = path.join(__dirname, 'flows.json');
let flows;
try {
  flows = JSON.parse(fs.readFileSync(flowsPath));
} catch (err) {
  console.warn('No pude leer flows.json:', err.message);
  process.exit(0);
}
// 3) Lista de IDs de tus nodos GSheet
const GsheetNodeIds = [
  '057f0d931ddff8f7',
  'e7534f9ecc49c258',
  'c3f645121877dab0'
];
// 4) Inyecta el objeto creds en cada nodo
let modified = false;
flows.forEach(node => {
  if (node.type === 'GSheet' && GsheetNodeIds.includes(node.id)) {
    node.creds = creds;
    modified = true;
  }
});
if (modified) {
  try {
    fs.writeFileSync(flowsPath, JSON.stringify(flows, null, 2));
    console.log('flows.json actualizado con las credenciales de Google Sheets.');
  } catch (err) {
    console.warn('Error al escribir flows.json:', err.message);
  }
} else {
  console.log('No se encontraron nodos GSheet para actualizar.');
}
process.exit(0);
