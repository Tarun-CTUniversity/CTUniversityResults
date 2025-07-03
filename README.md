📘 CT University Result Portal – Setup Guide
A full-stack MERN application with separate frontends for students and administrators, and an Express backend powered by MySQL.

📦 Requirements
Ensure the following software is installed on the new computer:

Tool	Version	Download Link
Node.js	v18+ (LTS preferred)	https://nodejs.org/
npm	v9+ (comes with Node)	
MySQL	5.7 or later	https://dev.mysql.com/downloads/
Git	Latest	https://git-scm.com/downloads
PM2 (optional)	For production	npm install -g pm2

🧾 1. Clone the Project
bash
Copy
Edit
git clone <your-github-repo-url>
cd <project-folder-name>
📁 2. Install All Dependencies
bash
Copy
Edit
npm install
This runs the postinstall script which installs dependencies for:

frontend/

adminfrontend/

backend/

⚙️ 3. Setup MySQL Database
✅ Steps:
Open MySQL CLI or GUI (e.g., phpMyAdmin).

Run:

sql
Copy
Edit
CREATE DATABASE ctuniversity;
Create a user or use your root credentials.

🔑 4. Configure Environment Variables
In the backend/ folder, create a file named .env:

bash
Copy
Edit
cd backend
touch .env
Edit .env and add:

env
Copy
Edit
PORT=4000
LOGIN_PASS=ctu@123  # Change this as per your choice
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ctuniversity
🌍 5. Update IP Address (Important)
In two places, update the IP address to match the current computer's local IP (e.g., 192.168.1.100):

🔧 (a) backend/server.js
js
Copy
Edit
// Replace this line:
app.listen(process.env.PORT, '192.168.124.197', () => {

// With this:
app.listen(process.env.PORT, '192.168.X.Y', () => {
Find your IP with:

bash
Copy
Edit
ipconfig     # on Windows
ifconfig     # on Linux/macOS
🔧 (b) frontend/vite.config.js
Update the proxy target:

js
Copy
Edit
proxy: {
  '/api': {
    target: 'http://192.168.X.Y:4000',  // Replace with your current local IP
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
🚀 6. Run the Application
bash
Copy
Edit
npm start
This will:

Run the frontend on http://localhost (port 80)

Run the backend on http://192.168.X.Y:4000

Run the admin panel on http://localhost:3000

✅ 7. Verify Running Services
App	URL
Frontend	http://localhost
Backend API	http://192.168.X.Y:4000/api/...
Admin Frontend	http://localhost:3000

🧪 8. Test the System
Open http://localhost — test student login via REG+DOB

Open http://localhost:3000 — upload Excel files, submit result data

API Test: http://192.168.X.Y:4000/getData/<REG_DOB> in browser or Postman

🏁 Optional: Run with PM2 (for background or production)
bash
Copy
Edit
npm run start-pm2
Make sure ecosystem.config.js contains:

js
Copy
Edit
module.exports = {
  apps: [
    {
      name: "backend",
      script: "backend/server.js",
      env: {
        PORT: 4000,
      },
    },
    {
      name: "frontend",
      script: "npm",
      args: "run start-frontend",
    },
    {
      name: "adminfrontend",
      script: "npm",
      args: "run start-adminfrontend",
    }
  ]
}
To manage:

bash
Copy
Edit
pm2 status
pm2 logs
pm2 restart all
pm2 stop all
🧹 Troubleshooting Tips
Problem	Solution
❌ Port 80 permission denied (Linux/Mac)	Use sudo or change port in vite.config.js
❌ MySQL not connecting	Check .env DB credentials and DB is running
❌ Proxy not working in Vite frontend	Ensure backend IP in vite.config.js is reachable
❌ PM2 apps not starting properly	Run pm2 logs for detailed errors

📁 Folder Overview
pgsql
Copy
Edit
project-root/
│
├── adminfrontend/      # Admin React app (CRA)
├── backend/            # Express + MySQL backend
├── frontend/           # Vite + React student frontend
├── .vscode/            # Editor configs
├── .gitignore
├── package.json        # Root runner (concurrently)
├── ecosystem.config.js # For PM2
└── README.md           # (Add this guide here)
