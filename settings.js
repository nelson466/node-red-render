/**
 * settings.js
 * Configuración de Node‑RED con CSS global responsive para Dashboard
 */

module.exports = {
  // Secret para cifrado interno de credenciales
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || "miClaveSecreta123",

  // Ruta base de tu Dashboard UI
  ui: {
    path: "ui",
    // Configuración de tema
    theme: {
      // Inyecta CSS en <head> de todas las páginas del Dashboard
      page: {
        css: `
          /* ------------------------------------------------
             CSS Global 100% Responsive para Node‑RED Dashboard
          ------------------------------------------------ */

          /* 1) Forzar que el grid use flexbox y envuelva */
          .nr-dashboard-template .nr-dashboard-row {
            display: flex !important;
            flex-wrap: wrap !important;
          }
          .nr-dashboard-template .nr-dashboard-row .nr-dashboard-col {
            box-sizing: border-box !important;
            padding: 4px !important;
          }

          /* 2) MÓVIL (≤600px): cada widget ocupa 100% */
          @media (max-width: 600px) {
            .nr-dashboard-template .nr-dashboard-row .nr-dashboard-col {
              flex: 0 0 100% !important;
              max-width: 100% !important;
            }
          }

          /* 3) TABLET (601–900px): cada widget ocupa 50% */
          @media (min-width: 601px) and (max-width: 900px) {
            .nr-dashboard-template .nr-dashboard-row .nr-dashboard-col {
              flex: 0 0 50% !important;
              max-width: 50% !important;
            }
          }

          /* 4) DESKTOP (>900px): respetar tu layout original */
          /* el grid de Node-RED Dashboard usará los Width/Columns que tengas */
        `
      }
    }
  },

  // (Opcional) Si necesitas exponer puertos, habilitar logging, etc.,
  // añádelos aquí. Pero para responsive basta con las propiedades anteriores.
};
