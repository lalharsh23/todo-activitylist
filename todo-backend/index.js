const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const activityRoutes = require("./routes/activity");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    "mongodb+srv://lalharsh1:Harshlal23@cluster0.sk2xr1e.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors(
  {
    origin:["https://deploy-mern-1whq.vercel.app"],
    method:["POST","GET"],
    credentials: true
  }
));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
