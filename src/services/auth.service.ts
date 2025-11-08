// Login and Registration service

import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Interface for Register and Login (same like .Net DTO classes)
interface Register{
    name: string;
    email: string;
    password: string;
};

interface Login{
    email: string;
    password: string;
};

// Register function which takes the Register interface
export const register = async (data: Register) => {
    try{
        // Check if the email user already exists in user table
        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // If exists the throw error
        if(existing) throw new Error("User already exists.");

        // If does not exists then hash the user entered password using Bcrypt with 10 rounds of salt
        const hashed = await bcrypt.hash(data.password, 10);

        // Store created user using Prisma ORM
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed
            }
        });

        return { message: "Registration successful.", user };
    }catch(err: any){
        return { message: "Error occured during registration.", err }
    }
};

export const login = async (data: Login) => {
    try{
        // Check if the user exists or not
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        // If no user then throw error
        if(!user) throw new Error("Invalid credentials");

        // If user exists, check the user entered password and user table stored password using bcrypt compare function
        const match = await bcrypt.compare(data.password, user.password);

        // If password does not match throw error
        if(!match) throw new Error("Invalid credentials");

        // If password matches then generate a token using jwt with the .env secret key
        // and in token data send userId and email and expiry time with 7d
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return { message: "Login successful",token };
    }catch(err: any){
        return { message: "Error occured during login.", err }
    }
};