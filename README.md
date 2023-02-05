# PPT Create front end and back end

- make word lists
- select images for word lists (Unsplash for now)
- create ppts for education purposes
- options for ppts: font size, translation, layout

- save word lists in local storage
- logged in users - save word lists in database

## Development

### Frontend

- cd into `client`
- `npm start`

### Backend

- cd into `server`
- `npm run dev`

#### Sample Data and deleting data - users

To load sample data, run the following command in your terminal:
`npm run sample`
This will populate the database with users for testing.

If you have previously loaded in this data, you can wipe your database 100% clean with:
`npm run blowitallaway`

> In createFakeUsers.js, you'll need to make a hash and salt for a fake user password. Create a salt and hash from a test password using the genPassword() function in passwordUtils.js

After loading sample data: create an admin account using the website running locally. Change `isAdmin` to true in MongoDB Atlas.
