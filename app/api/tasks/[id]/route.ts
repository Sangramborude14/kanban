import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(request: Request,{params}: {params: Promise<{id: string}>}){
    try{

        const {id} = await params;
        const body = await request.json();
        const {title , description , columnId} = body;

        const updatedTask = await prisma.task.update({
            where: {id},
            data: {
                title,
                description,
                columnId,
            },
        })
        return NextResponse.json(updatedTask);
    } catch(error) {
        console.error("failed to update ",error)
        return NextResponse.json({error: "failed to update"},{status: 500});
    }
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
    try{
        const {id} = await params;

        await prisma.task.delete({
            where: {id},
        })
        return NextResponse.json({success: true})
    }catch(error){
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}