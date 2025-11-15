import { cookies } from "next/headers";
import prismaclient from "../prisma/prisma";

export async function loginUser(_:any ,args:{
    email: string;
    password: string;
}) {

    try {
        const user=await prismaclient.user.findFirst({
            where:{
                email: args.email,
                password: args.password
            }
        });
        if(!user){
            throw new Error("Invalid Credentials");
        };
        const cookie = await cookies();
        cookie.set("Active_user",user.id);
        return user;
    } catch (error) {
        return null;
    }
}
export async function logoutUser() {
    try {
        const cookie = await cookies();
        cookie.delete("Active_user");
        return true;
    } catch (error) {
        return false;
    }   
}
export async function createUser(_:any ,args:{
    name: string;
    email: string;
    username: string;
    password: string;
    avatar?: string;}) {

    try {
        const newUser=await prismaclient.user.create({
            data:{
                name: args.name,
                email: args.email,
                username: args.username,
                password: args.password,
                avatar: args.avatar
            }
        });
        return newUser;                 
    } catch (error) {   
        throw new Error("Error creating user");
    }
}
export async function getuserByToken(_:any ,args:{userId: string;}) {

    try {
        const user=await prismaclient.user.findUnique({
            where:{
                id: args.userId
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}