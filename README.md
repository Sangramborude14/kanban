# KANBAN board

## a real time task management workspace

### workflow
 --->user login --> navigate to dashboard
                    ---> shows all board    ---> board  --->    board name
                                                            TODO    DOING   DONE
                                                            ----------------------
                                                            task1   task3   task2
                                                            taks4                   
                                                            -----------------------
                                                            online user in the board

                    ---> create board   ---> create board in db ---> navigate to board
                    ---> delete board   ---> delete board by id
                    ---> search boards  ---> filter board by name
                    ---> recent boards  ---> filter board by timeStamp --> refresh time in db

### important feature
* real time update in a board(socket.io)
* drag and drop of tasks
* show active users
* persistant editing
* task editing

### TASKS
1. create board component