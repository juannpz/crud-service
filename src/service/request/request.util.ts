export function buildAuthHeader(token: string) {
    return {
        Authorization: `Bearer ${token}`
    }
}

export function reBuildAuthHeader(req: Request) {
    return {
        Authorization: req.headers.get('Authorization')
    }
}