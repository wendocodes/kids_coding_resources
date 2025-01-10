# Project Name
Kids Coding Resources

## Description
Kids Coding Resources

## Tech Stack

- **Frontend**: Vue.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, Sequelize
- **Database**: SQLite

### 1. Backend (Express + Sequelize)

#### Server Setup (app.js)
- **express**: Sets up the web server to listen for requests.
- **sequelize**: Handles database operations (with the User and Resource models).
- **express-session**: Manages user sessions to track if a user is logged in and their role (admin or regular user).

#### Routes
- **auth.js**: Handles authentication routes (login, logout, session checking).
- **resources.js**: Handles the resource-related routes (fetching, adding, deleting resources).

#### Authentication (auth.js)
- **Login**: A user submits their credentials via a form. If the credentials are correct, the user is logged in and their session is stored on the server (`req.session.user = user`).
- **Session**: The `/api/auth/session` route checks if the user is logged in (session exists). If the session exists, the user’s data is returned; otherwise, a 401 Unauthorized response is sent.
- **Logout**: The `/logout` route destroys the user’s session, effectively logging them out.

#### Resources Management (resources.js)
- **Fetch Resources**: The resources are stored in a database, and can be fetched using an API (`/api/resources`).
- **Add/Delete Resources**: Admin users can add or delete resources. This is only allowed for users with an "admin" role.

### 2. Frontend (Vue3 + Static Files)

#### Vue.js (main.js)
- **State**: A reactive state (`state`) is used to track resources, the current user, and the new resource to be added.
- **Fetch Resources**: The app fetches resources from the backend via an API call (`/api/resources`).
- **User Session**: The app checks if the user is logged in by making an API request to `/api/auth/session` to get the current user data.
- **Add/Delete Resources**: If the user is an admin, they can add or delete resources via the frontend, and these actions will communicate with the backend to update the database.

## How It All Connects Together

### User Login
1. A user enters their credentials in the login form (`login.ejs`).
2. A POST request is sent to the `/login` route in `auth.js`.
3. The server verifies the username and password, and if successful, stores the user in the session (`req.session.user`).

### User Session Check
1. On the frontend, Vue.js calls `/api/auth/session` to check if the user is logged in.
2. If the session exists (the user is logged in), the user data is returned. Otherwise, a 401 Unauthorized response is sent.

### Displaying Resources
1. Resources are fetched from the backend using an API call (`/api/resources`).
2. Regular users can only view the resources, but admin users can add or delete them.

### Resource Filtering
1. On the frontend, the user can filter resources by category. The resources are stored in a reactive state and updated dynamically as the user interacts with the page.

### Admin Dashboard
1. If the logged-in user is an admin, they can view, add, and delete resources through the admin dashboard (`welcome.ejs`).


## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite
- Vue3
- Express

### Installation

1. **Clone the repository:**
bash git clone https://github.com/wendocodes/kids-coding-resources.git 
cd kids-coding-resources

2. **Install dependencies:**

```bash
npm install

3. Set up the database:
Ensure SQLite is installed on your machine.
Run the following command to initialize the database:
     npx sequelize-cli db:migrate
     ```
4. **Start the server:**
   
```bash
   node app.js

5. Access the application:
Open your browser and navigate to http://localhost:3000



Kids-CodingResources/
├── app.js               # Main Express server file
├── models/ 
│   ├── index.js         # Sequelize ORM configuration
│   ├── resources.js     # Resource and User models
├── routes/               # Routes for different sections of the app
│   ├── auth.js           # Authentication routes (login, logout, session)
│   ├── resources.js      # Resources API routes (add, delete, fetch)
├── public/               # Static files served to the frontend
│   ├── css/              # Stylesheets (CSS)
│   ├── main.js           # Frontend JavaScript for managing resources
│   ├── index.html        # Main HTML file
│   ├── views/            # EJS views for rendering HTML
│       ├── login.ejs     # Login page
│       ├── welcome.ejs   # Welcome page for regular users
│       ├── resources.ejs # Resource display page for admins
│   ├── components/       # Frontend components for interactive functionality
│       ├── animations.js
│       ├── SearchResources.js
