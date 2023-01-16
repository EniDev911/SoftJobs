const app = require("./app");

async function init() {
    await app.listen(3000);
    console.log("Server running on port http://localhost:3000")
}

init();