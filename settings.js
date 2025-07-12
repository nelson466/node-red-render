module.exports = {
  // Secret para el cifrado interno de credenciales de Node-RED
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",
  // (aquí podrías añadir otras configuraciones genéricas de Node-RED, pero
  // ya no necesitas middlewares de cookies en settings.js)
};
