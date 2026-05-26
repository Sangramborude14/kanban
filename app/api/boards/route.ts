import { NextResponse } from "next/server";
import prisma from "@/lib/db";


export async function GET() {
    try{
        const board = await prisma.board.findMany({
            orderBy: {
                id: "asc",
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

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const {title} = body;
        
        if(!title){
            return NextResponse.json({error: "Title is required"},{status: 400})
        }

        const newBoard = await prisma.board.create({
            data: {
                title,
                columns: {
                    create: [
                        { title: "To Do"},
                        { title: "In Progrss"},
                        { title: "Done"},
                    ]
                }
            },
            include: {
                columns: true
            }
        });
        return NextResponse.json(newBoard,{status: 201})
    }catch(error){
        console.error(`failed to create board`, error)
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}