const session = require("express-session");
const fetch = require("node-fetch");
module.exports = {
    // Otras configuraciones...
    credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET || " miClaveSecreta123",
    // Otras configuraciones...
}
