# Collaborative Real-Time Kanban Workspace

A high-performance, real-time collaborative Kanban board built with **Next.js (App Router)**, **React 19**, **Socket.io**, and **Prisma ORM** backed by a serverless **PostgreSQL** database. This system allows multiple users to view, edit, organize, and drag-and-drop tasks on a shared workspace with instantaneous state synchronization.

---

#### https://sangram2mail.atlassian.net/wiki/x/AYAF

## 🏛️ System Architecture

The application is structured as a decoupled client-server architecture containing three main logical blocks:
1. **Next.js Frontend & API Handlers**: Built with React Client Components for interactive UI and Next.js App Router endpoints for state persistence.
2. **Real-time Event Broker (Socket.io)**: A standalone Node.js WebSocket server running on port `3001` that manages WebSocket rooms and coordinates board updates between users.
3. **Database Layer (Neon PostgreSQL & Prisma)**: A serverless PostgreSQL instance accessed via Prisma client ORM using the PostgreSQL driver adapter.

### Architecture Topology & Data Flow

```mermaid
graph TD
    %% Define System Nodes
    subgraph Client [Client Workspace (Next.js Client Components)]
        UI[Board Component UI]
        DND[HTML5 Drag & Drop Handler]
        WS_Client[Socket.io-Client Connection]
    end

    subgraph Backend_API [Next.js API Routes]
        REST_API[REST API Handlers]
        Prisma_Client[Prisma Client ORM]
    end

    subgraph RealTime [Websocket Server (Standalone Node.js Server)]
        Socket_Server[Socket.io Server - Port 3001]
    end

    subgraph DataStore [Persistence Layer]
        PostgreSQL[(Neon PostgreSQL Serverless)]
    end

    %% Data Flow Connections
    UI -->|1. HTTP REST Requests| REST_API
    REST_API -->|2. Database Transactions| Prisma_Client
    Prisma_Client -->|3. SQL Queries| PostgreSQL
    
    UI -->|4. HTML5 Drag/Action Events| DND
    DND -->|5. DB Update| UI
    
    UI -->|6. Socket Connection| WS_Client
    WS_Client <-->|7. Room Communication (ws://)| Socket_Server
    
    Socket_Server -->|8. Broadcast Update Signal| WS_Client
    WS_Client -->|9. Trigger State Refetch| UI
```

---

## 🔄 Real-Time Collaboration Protocol

The application uses WebSockets to sync board modifications instantly across all active users looking at the same board. 

### Room Joining
When a user navigates to `/board/[id]`, the `Board` component instantiates a socket client and joins a specific channel.
- **Client Action**: `socket.emit("join-board", boardId)`
- **Socket.io Server Handler**: 
  ```typescript
  socket.on("join-board", (boardId) => {
      socket.join(boardId);
  });
  ```

### Live Mutation Broadcast
To keep database operations single-threaded and simplified, the application uses a **Notify-and-Refetch pattern**:

1. **User Mutation**: A user edits a task, moves it, or adds a column.
2. **Database Write**: The mutation is sent to the Next.js API server via a REST endpoint.
3. **Notify Server**: Once the database write succeeds, the client emits `board-update` to the WebSocket server:
   ```typescript
   socketRef.current?.emit("board-update", { boardId, action: "move-task" });
   ```
4. **Broadcast to Room**: The Socket.io server intercepts this event and broadcasts a `board-updated` event to all *other* sockets inside the board room:
   ```typescript
   socket.to(boardId).emit("board-updated", { action, data });
   ```
5. **State Synchronization**: Upon receiving the `board-updated` event, other clients fetch the latest state from the database:
   ```typescript
   socket.on("board-updated", () => {
       fetchBoard(); // REST API fetch to refresh UI
   });
   ```

---

## 🗄️ Database Schema & Relationships

The database is built on PostgreSQL with strict referential integrity. The entity relationship diagram (ERD) is represented below:

```mermaid
erDiagram
    BOARD {
        string id PK "UUID"
        string title
        datetime createdAt
    }
    COLUMN {
        string id PK "UUID"
        string title
        string boardId FK "References BOARD.id"
    }
    TASK {
        string id PK "UUID"
        string title
        string description "Optional"
        string columnId FK "References COLUMN.id"
        datetime createdAt
    }

    BOARD ||--o{ COLUMN : "contains (onDelete: Cascade)"
    COLUMN ||--o{ TASK : "contains (onDelete: Cascade)"
```

---

## 🔌 API Reference (REST Endpoints)

All server-side REST endpoints reside under the `/api` route prefix.

### Boards
- `GET /api/boards`
  - **Description**: Returns all boards, ordered by ID ascending.
  - **Response**: `200 OK` (Array of Board objects)
- `POST /api/boards`
  - **Description**: Creates a new board and automatically seeds it with three default columns: `To Do`, `In Progrss`, and `Done`.
  - **Body**: `{ "title": "My Board Name" }`
  - **Response**: `201 Created`
- `GET /api/boards/[id]`
  - **Description**: Returns a single board, containing all its columns, which in turn contain their respective tasks.
  - **Response**: `200 OK`
- `DELETE /api/boards/[id]`
  - **Description**: Deletes a board. Triggers cascade deletion of all child columns and tasks.
  - **Response**: `200 OK`

### Columns
- `POST /api/columns`
  - **Description**: Creates a column in a specific board.
  - **Body**: `{ "title": "Column Title", "boardId": "board-uuid" }`
  - **Response**: `201 Created`
- `DELETE /api/columns/[id]`
  - **Description**: Deletes an empty column.
  - **Response**: `200 OK`
  - **Constraint**: Returns `400 Bad Request` if the column contains any tasks to prevent accidental data loss.

### Tasks
- `POST /api/tasks`
  - **Description**: Creates a new task within a column.
  - **Body**: `{ "title": "Task Title", "description": "Optional description", "columnId": "column-uuid" }`
  - **Response**: `201 Created`
- `PATCH /api/tasks/[id]`
  - **Description**: Updates fields on a task. Used for editing titles/descriptions or shifting a task to another column during a drag-and-drop event.
  - **Body**: `{ "title": "Updated Title", "description": "Updated Description", "columnId": "new-column-uuid" }`
  - **Response**: `200 OK`
- `DELETE /api/tasks/[id]`
  - **Description**: Deletes a task.
  - **Response**: `200 OK`

---

## 📁 Repository Directory Structure

```text
kanban/
├── app/                              # Next.js Application router
│   ├── api/                          # Next.js REST API routes
│   │   ├── boards/                   # /api/boards & /api/boards/[id] handlers
│   │   ├── columns/                  # /api/columns & /api/columns/[id] handlers
│   │   └── tasks/                    # /api/tasks & /api/tasks/[id] handlers
│   ├── board/                        # Dynamic workspace routes
│   │   └── [id]/                     # Board view container
│   ├── globals.css                   # Global styling
│   ├── layout.tsx                    # Shell layout
│   └── page.tsx                      # Dashboard landing page
├── components/                       # Shared React components
│   └── Board.tsx                     # Core Client Kanban logic & Socket client
├── lib/                              # Client & Database utilities
│   ├── db.ts                         # Prisma Client Singleton wrapper
│   └── generated/                    # Prisma Auto-generated client files
├── prisma/                           # Schema declaration & Migration scripts
│   ├── schema.prisma                 # Database schema models
│   └── seed.ts                       # Seed scripts
├── socket/                           # Independent Socket server
│   └── server.ts                     # Socket.io Server logic
├── types/                            # Shared TS interfaces
│   └── board.ts                      # Board, Column, Task types
├── package.json                      # Dependency declarations
└── tsconfig.json                     # TS compiler rules
```

---

## 🛠️ Environment Configuration & Deployment

To launch the project locally or in production, configure the following environment variables:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection string (with SSL mode) | `postgresql://user:password@host/db?sslmode=require` |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket Server endpoint accessed by clients | `http://localhost:3001` or `https://socket-server.onrender.com` |
| `PORT` | Listening port for the standalone Socket.io server | `3001` |
| `CORS_ORIGIN` | Allowed domains for WebSocket CORS policy | `http://localhost:3000` or `https://kanban-client.vercel.app` |

### Running the Services Locally

1. **Database Migrations & Client Generation**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

2. **Run Socket Server**:
   ```bash
   npx tsx socket/server.ts
   ```

3. **Run Next.js Client App**:
   ```bash
   npm run dev
   ```