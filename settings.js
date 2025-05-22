module.exports = {
  // Configura aqui la clave de encriptacion.
  // Es recomendable establecer NODE_RED_CREDENTIAL_SECRET como variable de entorno en Render.com
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",
  // Puedes agregar mas configuraciones de Node-RED aqui si lo necesitas...
};
