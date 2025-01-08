import { z } from "zod";
import { dev } from "$app/environment";

export const clanApplicationSchema = z.object({
    tag: z.string().min(5).startsWith("#"),
    apiToken: z.string().nonempty(),
    "cf-turnstile-response": dev ? z.string() : z.string().nonempty()
});
