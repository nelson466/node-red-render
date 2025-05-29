const session = require("express-session");
const fetch = require("node-fetch");

module.exports = {
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",

  // Aplica estos dos middlewares a httpNode (todas las rutas http in, incluyendo el Dashboard)
  httpNodeMiddleware: [
    // 1) Inicia la sesión de Express, por si la usas en otros endpoints
    session({
      secret: process.env.SESSION_SECRET || "otroSecretoSeguro",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      }
    }),

    // 2) Valida la sesión PHP antes de servir cualquier /ui/*
    async function (req, res, next) {
      try {
        // Solo proteger la UI (dashboard)
        if (req.path.startsWith("/ui")) {
          // Llama al endpoint PHP pasando las mismas cookies del cliente
          const phpRes = await fetch("https://siot.kesug.com/check_session.php", {
            headers: { cookie: req.headers.cookie || "" },
          });

          if (phpRes.status === 200) {
            // OK: sigue al siguiente middleware (sirve el dashboard)
            return next();
          }
          // Si no es 200 (401), redirige al login PHP
          return res.redirect("https://siot.kesug.com");
        }
      } catch (err) {
        // En caso de error imprevisto, redirige al login
        return res.redirect("https://siot.kesug.com");
      }
      // Cualquier otra ruta no UI la dejamos pasar
      next();
    },
  ],
};
