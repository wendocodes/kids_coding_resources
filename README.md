# Project Name
Kids Coding Resources

## Description
Kids Coding Resources

## Tech Stack

- **Frontend**: Vue.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, Sequelize
- **Database**: SQLite

## Project Structure
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
│      
