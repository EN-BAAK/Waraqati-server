import express from "express";
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()

import { error } from "./src/middlewares/error";
import db from "./src/models"

import managerRouter from "./src/routers/managers"
import authRouter from "./src/routers/auth"
import userRouter from "./src/routers/users"
import employeeRouter from "./src/routers/employees"
import clientRouter from "./src/routers/clients"
import serviceRouter from "./src/routers/service"
import categoryRouter from "./src/routers/categories"
import questionRouter from "./src/routers/question"

const app = express()
app.use(cors({
  origin: [process.env.FRONTEND_URL!],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/v0/users", userRouter)
app.use("/api/v0/managers", managerRouter)
app.use("/api/v0/questions", questionRouter)
app.use("/api/v0/employees", employeeRouter)
app.use("/api/v0/clients", clientRouter)
app.use("/api/v0/services", serviceRouter)
app.use("/api/v0/categories", categoryRouter)
app.use("/api/v0/auth", authRouter)

app.use(error)

const port = process.env.PORT

db.sequelize!.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`)
  })
})