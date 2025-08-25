import { z } from "zod";
export const userSchema = z.object({
    phone: z.string().min(10,{message: "Phone number must be at least 10 characters long"}),
    password: z.string().min(6,{message: "Password must be at least 6 characters long"}),
}); 


export const paymentinfoschema = z.object({
    user_number: z.string().min(10,{message: "Phone number must be at least 10 characters long"}),
    token: z.string(),
    amount: z.number(),
})

export type UserSchema = z.infer<typeof userSchema>;
export type PaymentInfoSchema = z.infer<typeof paymentinfoschema>;