import { buildRequestResponse, Context, safeFetch } from "@juannpz/deno-service-tools";

export function buildBasicAuthMiddleware(sessionService: string) {
    return (
        async function basicAuthMiddleware(
            c: Context,
            next: () => Promise<void | Response>,
        ) {
            const jwt = c.req.header("Authorization");

            if (!jwt) {
                return c.json({ message: "Missing auth token" }, 401);
            }

            if (!jwt.startsWith("Bearer ")) {
                return c.json({ message: "Invalid auth token format" }, 401);
            }

            const veryfySessionResult = await safeFetch(
                fetch(`${sessionService}/v1/session/verify`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        jwt,
                    }),
                }),
            );

            if (!veryfySessionResult.ok) {
                console.error(veryfySessionResult.message);

                const response = buildRequestResponse(veryfySessionResult);
                response.code = 401;

                return c.json(response, response.code);
            }

            c.set("userId", 2);

            await next();
        }
    );
}
