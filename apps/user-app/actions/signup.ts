
"use server"
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";
import { PrismaClient } from "@repo/prisma/client";

const prisma = new PrismaClient();
export const getusers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

export default async function signupHandler(credentials: any) {
    try {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newuser = await prisma.user.create({
        data: {
            number: credentials.phone,
            password: hashedPassword,
        },
    }).catch((error) => {
        console.log(error);
        return "db error";
    });


    return "User created";
} catch (error) {
    console.log(error);
    return "User not created";
}
}
