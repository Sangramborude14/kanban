import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try{
        const board = await prisma.board.findUnique({
            where: {
                id: 'board1',
            },
            include:{
                columns: {
                    include: {
                        tasks: true,
                    },
                },
            },
        })

        if(!board){
            return NextResponse.json({error: "Board not found"},{status: 404});
        }

        return NextResponse.json(board);
    }catch(error){
        console.error(`failed to fetch board`,error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}