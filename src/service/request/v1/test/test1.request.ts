import { Router } from "@juannpz/deno-service-tools";

export const test1Request = Router.get("/test1/:id")
    .describe("test 1")
    .pathParam("id")
    .headerParam("Authorization")
    .handler((context) => {
        const userId = context.c.get("userId");

        const pathParam = context.c.req.param("id");

        if (userId != pathParam)
            return context.c.json({ message: `User id ${userId} does not match path param id ${pathParam}` }, 401);

        return context.c.json({ message: `test 1 passed with id ${context.params.id}`, userId: context.c.get("userId") }, 200);
    });