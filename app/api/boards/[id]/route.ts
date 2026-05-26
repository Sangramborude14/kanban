import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { error } from "console";

export async function GET(request: Request,{params}: {params: Promise<{id: string}>}) {
    try{
        const {id} = await params;
        const board = await prisma.board.findUnique({
            where: {id},
            include: {
                columns: {
                    include: {
                        tasks: true,
                    }
                }
            }
        })

        if(!board){
            return NextResponse.json({error: "Board not found"},{status: 404});
        }
        return NextResponse.json(board);
    }catch(error){
        console.error(`Failed to get board:`,error);
        return NextResponse.json({error:"Internal error occured"},{status: 500})
    }
}

export async function DELETE(request: Request,{params}: {params: Promise<{id: string}>}){
    try{
        const {id} = await params;
        
        await prisma.board.delete({
            where: {id},
        })
        return NextResponse.json({success: true})
    }catch(error){
        console.error(`error deleting board`)
        return NextResponse.json({error: "Internal error occured"},{status: 500});
    }
}