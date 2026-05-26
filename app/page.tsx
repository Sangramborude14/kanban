"use client"
import { useState, useEffect} from 'react';
import Link from 'next/link';
import { Trash } from 'lucide-react';

interface BoardBrief {
  id: string;
  title: string;
}

export default function Home(){
  const [boards,setBoards] = useState<BoardBrief[]>([]);

  const addBoard = async () => {
    const title = prompt("enter new board Title:");
    if(!title) return;

    try{
      const res = await fetch("/api/boards",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title}),
      })

      if(!res.ok) throw new Error("Failed to create board");

      const newBoard = await res.json()

      setBoards((prevBoard) => [...prevBoard,newBoard])
    }catch(error){
    console.error("Error adding board",error);
    alert("could not create board")
  }
  }
  
  const deleteBoard = async (e: React.MouseEvent,id: string, title:string) => {
    e.preventDefault();

    const confirmDelete = confirm(`Are you sure u want to delete ${title} ?`);
    if(!confirmDelete) return;

    try{
      const res = await fetch(`api/boards/${id}`,{
        method: "DELETE",
      });
      if(!res.ok) throw new Error("Failed to delete board");

      setBoards((prevBoards) => prevBoards.filter(board => board.id !== id))
    }catch(error){
      console.error("error deleting board")
      alert("Could not delete board");
    }
  }

  useEffect(() => {
    const fetchBoards = async () => {
      try{
        const res = await fetch("/api/boards");
        const data = await res.json();
        setBoards(data)
      }catch(error){
        console.error("failed ot load boards",error)
      }
    }
    fetchBoards();
    },[])

    return(
    <div className='p-8 min-h-screen'>
      <h1 className={boardTitle_css}>
      My Boards
      </h1>
      <button onClick={addBoard} className='text-center font-semibold mb-6 px-4 border-2 border-red-500 rounded hover:bg-red-500 hover:text-white transition-all ease-in-out'>
        + Create new board
      </button>
      <div className='flex flex-col gap-4 max-w-md'>
        {boards.map((board) => (
          <Link href={`/board/${board.id}`} key={board.id} className="p-4 border border-gray-800 hover:border-red-600 transition-all block">
            <div>
              <h2 className='text-xl m-2 font-bold hover:text-red-100 transition-all block'>
            {board.title}
            </h2>
            <span className="text-red-300 text-center font-extralight">
              ID: {board.id}
            </span>
            </div>
            <button onClick={(e) => deleteBoard(e,board.id,board.title)} className={deleteTaskBtn_css}>
              <Trash size={18}/>
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

const boardTitle_css = "text-center font-bold text-5xl p-2 m-6";
const deleteTaskBtn_css = "mx-2 border p-2 bg-black rounded-full mt-3 text-red-600 font-bold hover:scale-110 hover:text-2xl hover:bg-red-600 hover:text-black transition-all duration-200 ";
