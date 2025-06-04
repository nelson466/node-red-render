// 1) Requerimos el módulo 'cookie' para parsear cookies (opcional, simplifica lectura)
const cookie = require("cookie"); 
// 2) No necesitamos express-session para este flujo, bastará la cookie 'auth' que creamos.
// 3) Exportamos la configuración de Node-RED
module.exports = {
  // 4) Mantén aquí tu credentialSecret (para credenciales internas de Node-RED)
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",
  // 5) Agregamos un middleware global a todas las rutas httpNode (incluye /ui)
  httpNodeMiddleware: [
    // ┌───────────────────────────────────────────────────────────────────────────
    // 6) Middleware anónimo que intercepta TODO acceso a HTTP In (p.ej. /validador) 
    //    y especialmente a rutas que empiecen con /ui
    function (req, res, next) {
      // 7) Si la ruta solicitada no comienza con '/ui', dejamos pasar libremente
      if (!req.path.startsWith("/ui")) {
        return next();
      }
      // 8) Para rutas que sí comienzan con '/ui', buscamos la cookie 'auth'
      //    req.headers.cookie es algo como "other=foo; auth=1; otro=bar"
      const rawCookies = req.headers.cookie || "";
      // 9) Usamos el módulo 'cookie' para parsear todas en un objeto
      const cookies = cookie.parse(rawCookies);
      // 10) Si no tenemos 'auth' o su valor no es '1', redirigimos al login PHP
      if (!cookies.auth || cookies.auth !== "1") {
        // 10.1) La URL de tu login PHP en InfinityFree
        return res.redirect("https://siot.kesug.com/cerrar_sesion.php");
      }
      // 11) Si llegamos aquí, la cookie 'auth=1' existe => usuario autorizado
      next();
    }
    // └───────────────────────────────────────────────────────────────────────────
  ]
};
