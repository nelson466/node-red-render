#!/usr/bin/env node
// inject-creds.js
// Genera/actualiza flows_cred.json cifrando las credenciales con Node-RED internals
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// 1. Leer el JSON de credenciales desde la variable de entorno
authJson = process.env.GSHEET_SERVICE_ACCOUNT_JSON;
if (!authJson) {
  console.warn('⚠️ GSHEET_SERVICE_ACCOUNT_JSON no definida. No se generará flows_cred.json cifrado.');
  process.exit(0);
}
let creds;
try {
  creds = JSON.parse(authJson);
} catch (err) {
  console.warn('⚠️ GSHEET_SERVICE_ACCOUNT_JSON inválida:', err.message);
  process.exit(0);
}
// 2. Obtener el secreto de cifrado
const secret = process.env.NODE_RED_CREDENTIAL_SECRET || 'miClaveSecreta123';
// Derivar clave AES-256-GCM a partir del secreto
const key = crypto.createHash('sha256').update(secret).digest();
// IDs de credenciales usados por tus nodos GSheet
const CRED_IDS = [
  '3d0e07754521693a',
  '3d0e07754521693a',
  '3d0e07754521693a'
];
// Función para cifrar objeto con AES-256-GCM
def encrypt(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.from(JSON.stringify(obj));
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    type: 'credentials',
    algorithm: 'aes-256-gcm',
    data: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64')
  };
}
// 3. Construir objeto flows_cred.json cifrado
const flowsCred = {};
CRED_IDS.forEach(id => {
  flowsCred[id] = encrypt(creds);
});
// 4. Escribir flows_cred.json en la raíz
try {
  fs.writeFileSync(path.join(__dirname, 'flows_cred.json'), JSON.stringify(flowsCred, null, 2));
  console.log('✅ flows_cred.json cifrado generado con IDs:', CRED_IDS.join(', '));
} catch (err) {
  console.warn('⚠️ Error al escribir flows_cred.json cifrado:', err.message);
}
process.exit(0);
