import express, { Express } from "express";
import morgan from "morgan";
import DatabaseService from "./services/databaseService/databaseService";
import DatabaseConfig from "./config/databaseConfig";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import SwaggerDoc from "./swagger.json";
import errorHandler from "./middlewares/errorHandler/errorHandler";
import CacheService from "./services/cacheService/cacheService";
import CacheConfig from "./config/cacheConfig";
import SecurityRepository from "./repositories/securityRepository/securityRepository";
import SecurityService from "./services/securityService/securityService";

dotenv.config();

async function initializeDatabaseService(): Promise<DatabaseService> {
    const databaseConfig = new DatabaseConfig();
    const databaseService = DatabaseService.getInstance(databaseConfig);
    await databaseService.sync();
    console.log("Database initialized.");

    return databaseService;
}

async function initializeSecurityService(): Promise<SecurityService> {
    const repo = new SecurityRepository();
    const service = SecurityService.getInstance(repo);
    await service.addAllDefaultPermissions();

    const key = await service.createAdminKeyIfThereIsNoKeys();
    if (key) console.log(`YOUR SUPER ADMIN KEY: ${key.key}`);

    console.log("Security service initialized.");

    return service;
}

async function initializeCacheService(): Promise<CacheService | undefined> {
    if (CacheService.isCacheEnabled) {
        const cacheConfig = new CacheConfig();
        const cacheService = CacheService.getInstance(cacheConfig);
        await cacheService.connect();

        console.log("Cache initialized.");

        return cacheService;
    }
}

function initializeExpress(): Express {
    const app = express();

    app.use(express.json());
    app.use(morgan("short"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(SwaggerDoc));
    app.set("trust proxy", true);
    RegisterRoutes(app);

    app.use(errorHandler); // Error handler must be the last

    return app;
}

(async () => {
    await initializeDatabaseService();
    await initializeCacheService();
    await initializeSecurityService();
    const app = initializeExpress();

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
})();
