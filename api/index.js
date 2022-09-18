const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRouter = require("./routes/user")

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRouter)

app.listen(4000, () =>{
  console.log("App is running at http://localhost:4000")
})