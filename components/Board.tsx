"use client"
import { useState } from "react";
import { kanban,Column} from "@/types/board"


export default function Board(){
    const [board,setBoard] = useState<kanban>({
        id: 'board1',
        title: 'My Project Board',
        columns: [],
    })
}