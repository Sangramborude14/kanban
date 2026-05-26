import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const {title,boardId} = body;
        if(!title || !boardId){
            return NextResponse.json({error: "missing board"},{status: 400});
        }

        const column = await prisma.column.create({
            data: {
                title,
                boardId,
            },
        });

        return NextResponse.json(column,{status: 201})
    }catch(error){
        return NextResponse.json({error: "error getting request"},{status: 500})
    }
}