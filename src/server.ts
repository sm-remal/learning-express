import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = () => {
    // Initialize the database
    initDB();

    // App listen 
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`)
    })
}

main();