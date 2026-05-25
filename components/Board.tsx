"use client"
import { useState } from "react";
import { kanban,Column,Task} from "@/types/board";
 


export default function Board(){
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const addColumn = () => {
    const title = prompt("enter the column title");

    if(!title) return;
    const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: title,
        tasks: [],
        boardId: board.id
    }
    setBoard(prevBoard => {
        return {...prevBoard,
            columns: [...prevBoard.columns,newColumn]
        }
    })
    }

    const addTask = (column: Column) => {
    const id = `task-${Date.now()}`
    const title = prompt("enter the task title");
    const description = prompt("enter the description");
    const columnId = column.id
    const createdAt = date.toDateString();

    if(!title) return;
    if(columnId !== column.id) return;

    const newTask:Task = {
        id: id,
        title: title,
        description: description,
        columnId: columnId,
        createdAt: createdAt,
    }
    setBoard(prevBoard => {
        return {...prevBoard,columns: (
            prevBoard.columns.map((column) => {
            if (column.id === columnId){
                return { ...column,tasks: [...column.tasks,newTask]}
            }
            return column;
        }))

        }
    })
}

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
    <h1 className={boardTitle_css}>
      {board.title}
    </h1>
    <div className="m-4 text-center flex justify-center">
      {board.columns.map((column) => (
        <div key={column.id} className="flex-1 mx-4 p-3 border-3 border-cyan-950 mr-12">
          <h1 className="text-2xl text-red-400">
            {column.title}
          </h1>
          <div>
            {column.tasks.map((task) => (
              <div key={task.id} className={taskDiv_css}>
                <h1 className="font-bold mb-3 text-xl">
                  {task.title}
                </h1>
                <p className={taskPara_css}>{task.description}</p>
                <span className={taskSpan_css}>created at: {task.createdAt}</span>
              </div>
            ))}
            <div className="">
              <span>Add a Task</span>
              <br />
              <button className={addTaskBtn_css} onClick={() => addTask(column)} >+</button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex-1 mx-4 p-3 border-3 border-cyan-950 mr-12">
        <h1 className="text-2xl text-red-400">Add a column</h1>
        <div className={taskDiv_css}>
          <button onClick={addColumn} className="my-2 font-extrabold text-3xl p-3 px-5 border-4 rounded-full">
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</>)
}

const boardTitle_css = "text-center font-bold text-5xl p-2 m-6"
const taskPara_css = "font-light text-sm italic text-gray-300"
const taskSpan_css = "font-thin text-xs text-blue-400"
const taskDiv_css = "my-2 bg-gray-900 py-6 px-4"
const addTaskBtn_css = "font-extrabold  px-4 py-0 rounded-full m-2 text-2xl bg-gray-800 text-red-600"