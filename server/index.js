import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userroutes from "./routes/user.js";
import questionroutes from "./routes/question.js";
import answerroutes from "./routes/answer.js";
const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
    origin: "https://dev-query-w38v.vercel.app/", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
  }));

app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);
app.get("/", (req, res) => {
  res.send("Codequest is running perfect");
});

const PORT = process.env.PORT || 5010;
const database_url = process.env.MONGODB_URL;

mongoose
  .connect(database_url)
  .then(() => console.log("DB connection established"))
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
