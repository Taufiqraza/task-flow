const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./middleware/auth")
dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin",require("./routes/adminRoutes"));

app.get("/protected", auth, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user
  })
})

app.use("/api/tasks", require("./routes/taskRoute"));

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  }).catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
})