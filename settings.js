// 1) Importa el paquete 'cookie' para parsear la cabecera 'Cookie' de las peticiones HTTP.
//    Esto nos permitirá leer la cookie 'auth=1' en cada solicitud a /ui.
const cookie = require("cookie");

// 2) Importa el módulo nativo 'crypto' de Node.js. 
//    No es necesario instalarlo en package.json porque 'crypto' ya viene incorporado en Node.js.
const cryptoModule = require("crypto");

module.exports = {
  // 3) 'credentialSecret' protege las credenciales que Node-RED guarda internamente.
  //    Se recomienda definir NODE_RED_CREDENTIAL_SECRET como variable de entorno en Render.
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",

  // 4) 'functionGlobalContext' expone valores o módulos dentro de los nodos Function.
  //    Aquí hacemos disponible 'cryptoModule' como 'crypto', de modo que en cualquier nodo Function
  //    podamos llamarlo mediante global.get("crypto").
  functionGlobalContext: {
    // 4.1) Asignamos la instancia de crypto a la clave 'crypto'.
    crypto: cryptoModule
  },

  // 5) 'httpNodeMiddleware' es un array de middlewares que Node-RED ejecuta antes de cada ruta HTTP In.
  //    Incluye tanto las rutas regulares como las del Dashboard (/ui).
  httpNodeMiddleware: [
    function (req, res, next) {
      // 5.1) Verifica si la ruta solicitada empieza con "/ui". 
      //      Si NO empieza con "/ui", permitimos la petición sin más validaciones.
      if (!req.path.startsWith("/ui")) {
        return next();
      }

      // 5.2) Si la ruta SÍ comienza con "/ui", leemos la cabecera 'Cookie' de la petición.
      //      'req.headers.cookie' contiene todas las cookies en formato "clave1=valor1; clave2=valor2; ..."
      const rawCookies = req.headers.cookie || "";

      // 5.3) Usamos 'cookie.parse' para convertir la cadena en un objeto:
      //      ej. "auth=1; foo=bar" → { auth: '1', foo: 'bar' }
      const cookies = cookie.parse(rawCookies);

      // 5.4) Verificamos que exista la cookie 'auth' y que su valor sea exactamente '1'.
      //      Si no existe o no coincide, redirigimos al login PHP en InfinityFree.
      if (!cookies.auth || cookies.auth !== "1") {
        // 5.4.1) Enviamos un redirect 302 al usuario para que vaya a https://siot.kesug.com
        return res.redirect("https://siot.kesug.com/cerrar_sesion.php");
      }

      // 5.5) Si la cookie 'auth=1' está presente, dejamos pasar la petición a /ui.
      next();
    }
  ]
};
