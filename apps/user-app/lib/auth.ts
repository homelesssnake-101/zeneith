import CredentialsProvider from "next-auth/providers/credentials";
import { userSchema,UserSchema } from "@repo/zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@repo/prisma/client";
import GoogleProvider from "next-auth/providers/google";
const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId:String(process.env.NEXTAUTH_GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET),
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone", type: "text" },
                password: { label: "Password", type: "password" },
                
            },
            async authorize(credentials:any): Promise< any> {
                const check = userSchema.safeParse(credentials);
                if (!check.success) {
                    return null;
                }
                
                const user = await prisma.user.findUnique({
                    where: {
                        number: credentials.phone,
                    }
                })
                if (!user) {
                    console.log("user not found");
                    return null;
                }
              
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return user;
            },
        }),
    ], callbacks: {
        async jwt({ token, user,profile,account }: any) {
            if (user) {
                token.id = user.id
                token.name = user.name;
                token.number = user.number;
                token.imageUrl = user.imageUrl??null;

           
             
                token.password = user.password;

                
                
            }

            if(account?.provider === "google"){
                const googleuser = await prisma.user.findUnique({
                    where: {
                        email: profile?.email,
                    }
                })
                if(googleuser){
                    token.id = googleuser.id
                    token.name = googleuser.name;
                    token.number = googleuser.number;
                    token.imageUrl = googleuser.imageUrl??null;
                    token.password = googleuser.password;
                }

            }
            return token;
        },
        async session({ session, token }: any) {
            session.user.id = token.id;
            session.user.name = token.name;
          
     
            session.user.password = token.password;
           
            session.user.number = token.number;
            session.user.imageUrl = token.imageUrl??null;
           
            return session;
        },
    },
    secret:process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages:{
        signIn:"/auth/signin",

        error:"/auth/error",
        
        
        


    }
    
};