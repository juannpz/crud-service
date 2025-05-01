export function buildAuthHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

export function reBuildAuthHeaders(req: Request) {
    return { Authorization: req.headers.get('Authorization') };
}