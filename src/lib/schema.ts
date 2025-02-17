import { z } from "zod";
import { dev } from "$app/environment";

export const clanApplicationSchema = z.object({
    tag: z.string().min(5).max(10).startsWith("#"),
    apiToken: z.string().nonempty(),
    "cf-turnstile-response": dev ? z.string() : z.string().nonempty()
});

export const cwlApplicationSchema = z.object({
    tag: z.string().min(5).max(10).startsWith("#"),
    preferenceNum: z.number().int().min(1).max(20),
    "cf-turnstile-response": dev ? z.string() : z.string().nonempty()
});
