const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./db");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use(cors());
app.use("/images", express.static("images"));
app.use("/video", express.static("video"));

app.use("/auth", authRoutes);
app.use(interviewRoutes);
app.use(userRoutes);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected");
  } catch (err) {
    console.log(err);
  }
  console.log("Server running at 3000");
});
