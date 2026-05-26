import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { title } from "process";

export async function POST(request: Request){
    try{
        const body = await request.json();
        const {title,description,columnId} = body;

         if(!title || !columnId) {
        return NextResponse.json({error: "Missing Title or columnId"},{status: 400})
        }

        const task = await prisma.task.create({
            data: {
                title,
                description: description || null,
                columnId,
            },
        })
        return NextResponse.json(task,{status: 201})
    }catch(error){
        console.error(`failed to create a task`);
        return NextResponse.json({error: "internal server error"},{status: 500})
    }

   
}