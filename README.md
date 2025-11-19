# sust

## Backend
1. cd backend
2. npm install
2. node app.js

### Database import (dev only)

If you need to populate the local MySQL database for development, create a `.env` in `backend` with your MySQL credentials (do NOT commit `.env`) and run:

1. cd backend
2. npm install
3. node ./scripts/import-sql.js

The `db:import` script runs `scripts/import-sql.js`, which uses your `.env` values to create the `is463backend` database and import `tablesNdata.sql`.

Note: passwords in the seed data are plaintext for dev/testing. Use bcrypt + JWT for production.