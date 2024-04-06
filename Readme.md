Steps to set up the database:

1. In your terminal, cd into the repository
2. set up your .env file as shown below:
   PORT=8080
   DB_HOST=127.0.0.1
   DB_NAME=banquetHalls
   DB_USER=root
   DB_PASSWORD=rootroot
3. npm install
4. Run the script <npm run migrate> in terminal. (This command uses the migration files to create the necessary database tables and columns.)
5. Run the script <npm run seed> in terminal. (Seeds populate your newly created database tables with initial data from the seed files)
