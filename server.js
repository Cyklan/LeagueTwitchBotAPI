require("dotenv").config()

const express = require("express")
const cors = require("cors")
const routes = require("./routes")
const app = express()
app.use(cors())

app.use("/", routes)

app.listen(3000, () => {
	console.log("Listening on 3000")
})