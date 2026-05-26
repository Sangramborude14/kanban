import "dotenv/config"
import { title } from "process";

import prisma from "../lib/db";

async function main() {
    
    await prisma.task.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();


    const board = await prisma.board.create({
        data: {
            id: "board1",
            title: "My Project Board",
            columns: {
                create: [
                    {
                        id: "1234",
                        title:"To Do",
                        tasks: {
                            create: [
                                {
                                    id: "1",
                                    title: "play gta 5",
                                    description: "i have to play gta5"
                                }
                            ]
                        }
                    },
                    {
                        id: "1235",
                        title: "In Progress",
                        tasks: {
                            create: [
                                {
                                    id: "2",
                                    title: "eat donut",
                                    description: "i want to eat a choco donut"
                                }
                            ]
                        }
                    },
                    {
                        id: "12346",
                        title: "Done",
                        tasks: {
                            create: [
                                {
                                    id: "3",
                                    title: "cycling",
                                    description: "go 5Km cycling",
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })
}

main().catch((e) => {
    console.log(`seeding failed`,e)
})
.finally(
    async () => {
        await prisma.$disconnect();
    }
)