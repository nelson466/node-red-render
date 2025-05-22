#!/usr/bin/env node
// inject-creds.js
// Genera/actualiza flows_cred.json para tus nodos node-red-contrib-google-sheets.
const fs = require('fs');
const path = require('path');
// 1. Leer el JSON de credenciales desde la variable de entorno
const raw = process.env.GSHEET_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.warn('GSHEET_SERVICE_ACCOUNT_JSON no definida. No se generará flows_cred.json.');
  process.exit(0);
}
let creds;
try {
  creds = JSON.parse(raw);
} catch (err) {
  console.warn('GSHEET_SERVICE_ACCOUNT_JSON no es un JSON válido:', err.message);
  process.exit(0);
}
// 2. Claves “creds” usadas por cada uno de tus 3 nodos GSheet
//    Estos valores los ves en tu flows.json: el campo "creds" de cada nodo.
const CRED_IDS = [
  '3d0e07754521693a', // para el nodo id 057f0d931ddff8f7
  '3d0e07754521693a', // para el nodo id e7534f9ecc49c258
  '3d0e07754521693a'  // para el nodo id c3f645121877dab0
];
// 3. Construir el objeto que irá en flows_cred.json
const flowsCred = {};
CRED_IDS.forEach(id => {
  flowsCred[id] = creds;
});
// 4. Escribir (o sobrescribir) el archivo flows_cred.json en la raíz
const outPath = path.join(__dirname, 'flows_cred.json');
try {
  fs.writeFileSync(outPath, JSON.stringify(flowsCred, null, 2));
  console.log(`flows_cred.json generado con claves: ${CRED_IDS.join(', ')}`);
} catch (err) {
  console.warn('⚠️  Error al escribir flows_cred.json:', err.message);
}
process.exit(0);
