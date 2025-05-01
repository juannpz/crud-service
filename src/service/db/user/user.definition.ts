export interface IUserTable<T = Record<string, unknown>> extends Record<string, unknown> {
    user_id: number;
    user_status_id: number;
    metadata: T;
}