import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { error } from "console";

export async function DELETE(request: Request,{params}: {params: Promise<{id: string}>}){
    try {
        const {id} = await params;
        const column = await prisma.column.findUnique({
            where: {id},
            include:{tasks: true}
        });

        if(!column){
            return NextResponse.json({error: "Column not found"},{status: 404})
        }
        
        if(column.tasks.length > 0){
            return NextResponse.json({error: "cannot delete a column that contains a task"},{status: 400});
        }

        await prisma.column.delete({
            where: {id}
        })

        return NextResponse.json({success: true})
    }catch(error){
        console.error("failed to delete column")
        return NextResponse.json({error: "failed to delete column"},{status: 500})
    }
}