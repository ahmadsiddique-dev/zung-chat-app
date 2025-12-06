import app from "./app.js"
import customError from "./src/utils/customError.js";
import dbConnection from "./src/utils/db.js"

const port = process.env.PORT || 8000;
dbConnection()
.then(() => {
    app.get("/", (req, res) => {
        res.send({
            success : true
        })
    })
    app.listen(port, () => {
        console.log(`App is running at http://localhost:${port}`)
    })
})
.catch((err) => {
    throw new customError(err.message, 501);
})