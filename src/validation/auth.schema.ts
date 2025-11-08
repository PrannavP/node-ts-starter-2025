import { z } from "zod";

// Registration schema
export const registerSchema = z.object({
    name: z.string().min(2).max(20), // name should be string, min 2 and max 20
    email: z.string().email(), // email should be string and zod email validation (uses regex)
    password: z.string().min(6).max(50) // password should be string, min 6 and max 50
});

// Login schema
export const loginSchema = z.object({
    email: z.string().email(), // email should be string and zod email validation (uses regex)
    password: z.string().min(6).max(50) // password should be string, min 6 and max 50
});