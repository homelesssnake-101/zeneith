"use server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@repo/prisma/client";
const prisma = new PrismaClient();
export default async function signupHandler(credentials) {
    try {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const newuser = await prisma.user.create({
            data: {
                number: credentials.phone,
                password: hashedPassword,
            },
        });
        return "User created";
    }
    catch (error) {
        console.log(error);
        return "User not created";
    }
}
