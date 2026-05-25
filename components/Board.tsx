"use client"
import { useState } from "react";
import { kanban,Column} from "@/types/board"
import { title } from "process";


export default function Board(){
    const task1 = {
        id: '1',
        title: 'play gta 5',
        description: 'i have to play gta 1 hour',
        columnId: '1234',
        createdAt: `${Date.now()}`
    }
    const task3 = {
        id: '2',
        title: 'eat donut',
        description: 'i want to eat a choco donut',
        columnId: '1235',
        createdAt: `${Date.now()}`,
    }
    const task4 = {
        id: '3',
        title: 'cycling',
        description: 'go 5Km cycling',
        columnId: '1236',
        createdAt: `${Date.now()}`,
    }

     const column1 = {
        id: '1234',
        title: 'To Do',
        tasks: [task1],
        boardId: 'board1',
    }
    const column2 = {
        id: '1235',
        title: 'In Progress',
        tasks: [task3],
        boardId: 'board1',
    }

    const column3 = {
        id: '12346',
        title: 'Done',
        tasks: [task4],
        boardId: 'board1',
    }
    const [board,setBoard] = useState<kanban>({
        id: 'board1',
        title: 'My Project Board',
        columns: [column1,column2,column3],
    })   
    
    return(<>
    <div>
        <h1>{board.title}</h1>
        <div>
            {board.columns.map((column) => (
                <div key={column.id}>
                    <h1>{column.title}</h1>
                    <div>
                        {column.tasks.map((task) => (
                            <div key={task.id}>
                                <h1>{task.title}</h1>
                                <p>{task.description}</p>
                                <span>created at : {task.createdAt}</span>
                            </div>
                    ))} 
        </div>
    </div>
))}
     </div>
    </div>
    </>)
}