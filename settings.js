module.exports = {
  // Especifica el nombre del archivo de flujos que quieres usar
  flowFile: 'flows.json',
  // Clave que Node-RED usa para cifrar/descifrar tus credenciales de nodo
  // (asegúrate de tener definida NODE_RED_CREDENTIAL_SECRET en Render)
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",
  // Aquí podrías añadir más configuraciones si las necesitas...
};
