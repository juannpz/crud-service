import { CREATE_USER_CREDENTIALS_TABLE_QUERY } from "./userCredentials/userCredentials.definition.ts";
import { CREATE_USER_STATUS_TABLE_QUERY } from "./userStatus/userStatus.definition.ts";
import { CREATE_USER_TABLE_QUERY } from "./users/users.definition.ts";
import { IDatabaseConfig } from "../service.definition.ts";
import { Client } from "@db/postgres";

export class DatabaseClient {
    protected static client: Client | null = null;
    
    protected constructor() { }

    public static async init(config: IDatabaseConfig) {
        this.client = new Client({
            database: config.DB_NAME,
            hostname: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            host_type: "tcp",
            tls: {
                enabled: false
            }
        });

        await this.client.connect();

        await this.generateTables();
    }

    private static async generateTables() {
        await Promise.all([
            this.createUsersTable(),
            this.createUserCredentialsTable(),
            this.createUserStatusTable()
        ]);
    }

    private static async createUsersTable() {
        if (!this.client)
            throw new Error("Postgres client not initialized");

        return await this.client.queryObject(CREATE_USER_TABLE_QUERY);
    }

    private static async createUserCredentialsTable() {
        if (!this.client)
            throw new Error("Postgres client not initialized");

        return await this.client.queryObject(CREATE_USER_CREDENTIALS_TABLE_QUERY);
    }

    private static async createUserStatusTable() {
        if (!this.client)
            throw new Error("Postgres client not initialized");

        return await this.client.queryObject(CREATE_USER_STATUS_TABLE_QUERY);
    }
}