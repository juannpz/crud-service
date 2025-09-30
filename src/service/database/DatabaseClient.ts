import { CREATE_USER_CREDENTIALS_NOTIFICATION_TRIGGER, CREATE_USER_CREDENTIALS_TABLE_QUERY } from "./userCredentials/userCredentials.definition.ts";
import { CREATE_USER_STATUS_TABLE_QUERY } from "./userStatus/userStatus.definition.ts";
import { CREATE_USER_TABLE_QUERY } from "./users/users.definition.ts";
import { DatabaseConfig } from "../service.definition.ts";
import { Pool, PoolClient } from "@db/postgres";

export class DatabaseClient {
    protected static pool: Pool | null = null;
    
    protected constructor() { }

    protected static async _init(config: DatabaseConfig) {
        this.pool = new Pool({
            database: config.DB_NAME,
            hostname: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            host_type: "tcp",
            tls: {
                enabled: false
            }
        }, 10);

        const poolClient = await this.pool.connect();
        
        try {
            await this.generateTables(poolClient);
            await this.generateNotificationTriggers(poolClient);

        } finally {
            poolClient.release();
        }
    }

    protected static async disconnect() {
        if (!this.pool)
            throw new Error("Postgres pool not initialized");

        await this.pool.end();
    }

    protected static async getClient() {
        if (!this.pool)
            throw new Error("Postgres pool not initialized");

        return await this.pool.connect();
    }

    private static async generateTables(client: PoolClient) {
        await Promise.all([
            client.queryObject(CREATE_USER_TABLE_QUERY),
            client.queryObject(CREATE_USER_CREDENTIALS_TABLE_QUERY),
            client.queryObject(CREATE_USER_STATUS_TABLE_QUERY)
        ]);
    }

    private static async generateNotificationTriggers(client: PoolClient) {
        await Promise.all([
            client.queryObject(CREATE_USER_CREDENTIALS_NOTIFICATION_TRIGGER)
        ]);
    }
}