"use client"
import { useEffect, useState } from "react";
import { kanban,Column,Task} from "@/types/board";
import {Trash,SquarePen} from "lucide-react";
import { title } from "process";



export default function Board(){
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const addColumn = async () => {
    const title = prompt("enter the column title");
    if(!board) return;

    if(!title) return;
    try{
        const res = await fetch("/api/columns",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                boardId: board.id
            })
        })

        if(!res.ok){
            throw new Error("failed to save column to database");
        }

        const newColumn: Column = await res.json();

         setBoard(prevBoard => {
        if(!prevBoard) return null;
        return {...prevBoard,
            columns: [...prevBoard.columns,newColumn]
        }
    })

    }catch(error){
        console.error("error adding column");
        alert("error adding column")
    }
    }

    const addTask = async (column: Column) => {
        if(!board) return ;

    const id = `task-${Date.now()}`
    const title = prompt("enter the task title");
    const description = prompt("enter the description");
    const columnId = column.id
    const createdAt = date.toDateString();

    if(!title) return;
    if(columnId !== column.id) return;

    try{
        const res = await fetch("/api/tasks",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                columnId,
            }),
        })

        if(!res.ok){
            throw new Error("failed to save task to database");
        }
        const newTask = await res.json();

        const formattedTask: Task = {
            ...newTask,
            createdAt: new Date(newTask.createdAt).toDateString(), //??
        }

         setBoard(prevBoard => {
        if(!prevBoard) return null;
        return {...prevBoard,columns: (
            prevBoard.columns.map((column) => {
            if (column.id === columnId){
                return { ...column,tasks: [...column.tasks,formattedTask]}
            }
            return column;
        }))

        }
    })
    }catch(error){
        console.error("error adding task");
        alert("error adding task")
    }
   
}

const deleteTask = async(columnId: string, taskId: string) => {
    try{
        const res = await fetch(`/api/tasks/${taskId}`,{
            method: "DELETE",
        })

        if(!res.ok){
            throw new Error("failed to delete task")
        }

        setBoard(prevBoard => {
            if(!prevBoard) return null;
            return {
                ...prevBoard,
                columns: prevBoard.columns.map((col) => {
                    if(col.id === columnId) {
                        return{
                            ...col,
                            tasks: col.tasks.filter((task) => task.id !== taskId)
                        }
                    }
                    return col;
                })
            }
        })

    }catch(error){
        console.error(`error deleting task`);
        alert(`error deleting task`)
    }
        
}

const editTask = async(coloumnId:string,taskId:string) => {
    if(!board) return;

    const currentColumn = board.columns.find(col => col.id === coloumnId)
    const currentTask  = currentColumn?.tasks.find(t => t.id === taskId);

    if(!currentTask) return ;

    const newTitle = prompt("Edit Task Title",currentTask.title)

    if(!newTitle) return;
    const newDescription = prompt("Edit Task description:",currentTask.description || "");

    try{
        const res = await fetch(`/api/tasks/${taskId}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription,
            })
        })

        if(!res.ok){
            throw new Error("failed to edit task");
        }

        const updatedTask = await res.json();

         setBoard(prevBoard => {
        if(!prevBoard) return null;
        return{
        ...prevBoard,
        columns: prevBoard.columns.map(col => {
            if(col.id === coloumnId){
                return {
                    ...col,
                    tasks: col.tasks.map((task) => {
                        if(task.id === taskId){
                            return  {...task,title: updatedTask.title,description: updatedTask.description,}
                        }
                        return task;
                        
                    })
                }
            }
            return col;
        })
    }})
    }catch(error){
        console.error(`error editing task`);
        alert(`error updating task`)
    }
}

const handleDragStart = (e: React.DragEvent,taskId: string, sourceColId: string) => {
    e.dataTransfer.setData("taskId",taskId);
    e.dataTransfer.setData("sourceColId",sourceColId);
}

const handleDrop = async(e: React.DragEvent, targetColId: string) => {   
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColId = e.dataTransfer.getData("sourceColId");

    if(sourceColId == targetColId) return;

    try{
        const res = await fetch(`/api/tasks/${taskId}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                columnId: targetColId,
            }),
        })
        if(!res.ok){
            throw new Error(`failed to add new task`)
        }

         setBoard(prevBoard => {
        if(!prevBoard) return null;

        const sourceCol = prevBoard.columns.find(col => col.id === sourceColId);

        const taskToMove = sourceCol?.tasks.find(t => t.id === taskId);

        if(!taskToMove) return prevBoard;

        return {
            ...prevBoard,
            columns: prevBoard.columns.map(col => {
                if(col.id === sourceColId){
                    return {
                        ...col,
                        tasks: col.tasks.filter(t => t.id !== taskId)
                    }
                }

                if(col.id === targetColId){
                    return{
                        ...col,
                        tasks: [...col.tasks,{...taskToMove,columnId: targetColId}]
                    }
                }
                return col;
            })
        }
    })

    }catch(error){
        console.error(`error updating task`)
    }

   
}
 
    const [board,setBoard] = useState<kanban | null>(null)
    
    useEffect(() => {
        const fetchBoard = async () => {
            try{
                const res = await fetch("/api/boards");
                const data = await res.json();
                setBoard(data);
            }catch(error){
                console.error("error fetching board",error);
            }
            
        }
        fetchBoard();
    },[])
    
    if(!board){
        return(<>
        <div>
            Loading Board .....
        </div>
        </>)
    }
    return(<>
  <div className="h-screen overflow-hidden w-screen">
    <h1 className={boardTitle_css}>
      {board.title}
    </h1>
    <div className="m-4 text-center flex justify-center">
      {board.columns.map((column) => (
        <div key={column.id}
         className= {columnDiv_css}
         onDragOver= {(e) => e.preventDefault()}
         onDrop={(e) => handleDrop(e, column.id)}>
          <h1 className="text-2xl text-red-400">
            {column.title}
          </h1>
          <div>
            {column.tasks.map((task) => (
              <div key={task.id}
               className={taskDiv_css}
               draggable
               onDragStart={(e) => handleDragStart(e,task.id,column.id)}>
                <h1 className="font-bold mb-3 text-xl">
                  {task.title}
                </h1>
                <p className={taskPara_css}>{task.description}</p>
                <span className={taskSpan_css}>created at: {task.createdAt}</span><br/>
                <button className={deleteTaskBtn_css} onClick={() => deleteTask(column.id,task.id)}
                ><Trash size={18}/>
                </button>
                <button className={deleteTaskBtn_css} onClick={() => editTask(column.id,task.id)}>
                   <SquarePen size={18}/>
                </button>
              </div>
            ))}
            <div>
              <span>Add a Task</span>
              <br />
              <button className={addTaskBtn_css} onClick={() => addTask(column)} >+</button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex-1 mx-4 p-3 border-3 border-cyan-950 mr-12">
        <h1 className="text-2xl text-red-400">Add a column</h1>
        <div className= {taskDiv_css}>
          <button onClick={addColumn} className="my-2 font-extrabold text-3xl p-3 px-5 border-4 rounded-full ">
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
const deleteTaskBtn_css = "mx-2 border p-2 bg-black rounded-full mt-3 text-red-600 font-bold hover:scale-110 hover:text-2xl hover:bg-red-600 hover:text-black transition-all duration-200 "
const columnDiv_css = "flex-1 mx-4 p-3 border-3 border-cyan-950 mr-12"