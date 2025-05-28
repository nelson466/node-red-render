const session = require("express-session");

module.exports = {
  // Clave para cifrado de credenciales (manténla en variable de entorno en Render.com)
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",

  // Middlewares de Express que se aplican a httpNode (incluye Dashboard /ui)
  httpNodeMiddleware: [
    // 1) Inicializa sesión
    session({
      secret: process.env.SESSION_SECRET || "otroSecretoSeguro",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,       // true si tu Render.com usa HTTPS obligatorio
        maxAge: 24 * 60 * 60 * 1000  // 1 día
      }
    }),
    // 2) Verifica sesión para rutas /ui
    function(req, res, next) {
      // Solo interceptamos el Dashboard
      if (req.path.startsWith("/ui")) {
        if (!req.session.user) {
          // No autenticado: redirige al login externo
          return res.redirect("http://siot.kesug.com");
        }
      }
      next();
    }
  ]
};
