"use client"
import { useState } from "react";
import { kanban,Column} from "@/types/board"
import { title } from "process";


export default function Board(){
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const task1 = {
        id: '1',
        title: 'play gta 5',
        description: 'i have to play gta 1 hour',
        columnId: '1234',
        createdAt: `${date.toDateString()}`
    }
    const task3 = {
        id: '2',
        title: 'eat donut',
        description: 'i want to eat a choco donut',
        columnId: '1235',
        createdAt: `${date.toDateString()}`,
    }
    const task4 = {
        id: '3',
        title: 'cycling',
        description: 'go 5Km cycling',
        columnId: '1236',
        createdAt: `${date.toDateString()}`,
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
    <div className="h-screen overflow-hidden w-screen">
        <h1 className={boardTitlecss}>
            {board.title}
        </h1>
        <div className="m-4 flex w-full text-center">
            {board.columns.map((column) => (
                <div key={column.id} className="flex-1 mx-4 p-3 border-3 border-cyan-950 mr-12">
                    <h1 className="text-2xl text-red-400">
                        {column.title}
                        </h1>
                    <div>
                        {column.tasks.map((task) => (
                            <div key={task.id} className="my-2 bg-gray-900 py-6 px-4">
                                <h1 className="font-bold mb-3 text-xl">
                                    {task.title}
                                    </h1>
                                <p className="font-light text-sm italic text-gray-300">{task.description}</p>
                                <span className="font-thin text-xs text-blue-400">created at: {task.createdAt}</span>
                            </div>
                    ))} 
        </div> 
    </div>
))}
     </div>
    </div>
    </>)
}

const boardTitlecss = "text-center font-bold text-5xl p-2 m-6"