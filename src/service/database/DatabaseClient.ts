import { CREATE_USER_CREDENTIALS_TABLE_QUERY } from "./userCredentials/userCredentials.definition.ts";
import { CREATE_USER_STATUS_TABLE_QUERY } from "./userStatus/userStatus.definition.ts";
import { CREATE_USER_TABLE_QUERY } from "./users/users.definition.ts";
import { IDatabaseConfig } from "../service.definition.ts";
import { Pool, PoolClient } from "@db/postgres";

export class DatabaseClient {
    protected static pool: Pool | null = null;
    
    protected constructor() { }

    public static async init(config: IDatabaseConfig) {
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

        const client = await this.pool.connect();
        try {
            await this.generateTables(client);
        } finally {
            client.release();
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
}