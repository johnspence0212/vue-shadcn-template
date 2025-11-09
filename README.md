# Vue + .NET Full Stack Template

A modern, production-ready full-stack application template with Vue 3 frontend and .NET 9 backend.

## 🎯 Purpose

This template provides a complete foundation for building full-stack web applications with:

- **Frontend:** Vue 3 + TypeScript + shadcn-vue + Tailwind CSS
- **Backend:** .NET 9 Web API + Entity Framework Core + SQLite
- **Ready-to-use:** Generic CRUD operations, routing, state management, and API integration
- **Developer-friendly:** Clear structure, best practices, and comprehensive documentation

Perfect for quickly starting new projects without the boilerplate setup hassle.

## 📁 Project Structure

```
vue-shadcn-template/
├── frontend/                    # Vue 3 application
│   ├── src/
│   │   ├── api/                # API client & types
│   │   ├── components/         # Vue components
│   │   │   ├── common/         # Shared components
│   │   │   └── ui/             # shadcn-vue components
│   │   ├── views/              # Page components
│   │   ├── router/             # Route definitions
│   │   ├── stores/             # Pinia state management
│   │   └── App.vue
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md               # Frontend documentation
│
└── backend/                     # .NET 9 Web API
    └── Api/
        ├── Controllers/         # API endpoints
        ├── Models/             # Entity models
        ├── Data/               # Database context & config
        ├── Extensions/         # Service registration
        ├── Program.cs          # Entry point
        ├── appsettings.json    # Configuration
        └── README.md           # Backend documentation
```

### Frontend Features

- ✅ Vue 3 with TypeScript
- ✅ shadcn-vue UI components
- ✅ Tailwind CSS v4
- ✅ Vue Router
- ✅ Pinia state management
- ✅ Axios API client
- ✅ Generic BaseApi class

### Backend Features

- ✅ .NET 9 Web API
- ✅ Entity Framework Core
- ✅ SQLite database
- ✅ Generic BaseController for CRUD
- ✅ Swagger UI
- ✅ CORS configured
- ✅ Dependency injection pattern

## 🚀 First Time Setup

### Prerequisites

- **Node.js** (v20.19.0 or v22.12.0+)
- **.NET SDK** (v9.0+)
- **Git**

### 1. Get the Template

**Option A: Clone this repository**

```bash
git clone https://github.com/johnspence0212/vue-shadcn-template.git my-project
cd my-project
```

**Option B: Use as GitHub Template**

1. Click the "Use this template" button on GitHub
2. Create your new repository
3. Clone your new repository

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Setup Backend

```bash
cd backend/Api
dotnet restore
```

**That's it!** The database will be created automatically on first run.

## 🏃 Running the Application

You need to run both frontend and backend servers simultaneously.

### Terminal 1: Backend API

```bash
cd backend/Api
dotnet run
```

The API will start at `http://localhost:5000`

- Swagger UI: `http://localhost:5000/swagger`

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

### Verify Connection

Open `http://localhost:5173` in your browser. The frontend is configured to communicate with the backend API.

## 📖 Using as a Template

This template is designed to be cloned and customized for your own projects.

### Quick Customization Checklist

1. **Update project name** in `package.json` (frontend)
2. **Configure database name** in `backend/Api/appsettings.json`
3. **Update API URL** if needed in `frontend/src/api/base/client.ts`
4. **Remove example views** and create your own
5. **Add your entities** to the backend (see backend README)
6. **Create corresponding API clients** in frontend (see frontend README)

### Detailed Documentation

Both frontend and backend have comprehensive READMEs with step-by-step guides:

- **Frontend Guide:** [`frontend/README.md`](frontend/README.md)

  - Adding API integration
  - Creating components
  - Adding views and routes
  - State management with Pinia

- **Backend Guide:** [`backend/README.md`](backend/README.md)
  - Adding entities
  - Creating controllers
  - Database configuration
  - API documentation

### Example Workflow: Adding a Feature

1. **Backend:** Create entity → Create configuration → Add DbSet
2. **Backend:** Create controller (inherits from BaseController)
3. **Frontend:** Define TypeScript interface → Create API client
4. **Frontend:** Create view component → Add route
5. **Test:** Use Swagger UI for backend, browser for frontend

## 🛠️ Tech Stack

### Frontend

- Vue 3 + TypeScript
- Vite
- Vue Router
- Pinia
- Axios
- shadcn-vue
- Tailwind CSS v4

### Backend

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger/OpenAPI

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to build something amazing! 🚀**
