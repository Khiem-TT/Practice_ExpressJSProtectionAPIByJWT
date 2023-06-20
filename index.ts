import express from "express";
import bodyParser from "body-parser";
import {DatabaseModel} from "./src/models/database.model";
import router from "./src/routers/router";

const port = 8000;
const app = express();

app.use(bodyParser.json());

DatabaseModel.connectDB()
    .then(() => console.log('DB connected!'))
    .catch(error => console.log('DB connection error', error.message));

app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});