const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const activityRoutes = require("./routes/activity");

const app = express();
const PORT = process.env.PORT || 5000;

const DB =
    "mongodb+srv://lalharsh1:HekwAbKP47EsliIt@cluster0.sk2xr1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/activity-project";

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//acquire the connection(to check if it's successful)
const db = mongoose.connection;

//error
db.on("error", function (err) {
    console.log(err.message);
});

//up and running then print the message
db.once("open", function () {
    console.log(
        `Successfully connected to the database :: MongoDB`
    );
});

app.use(
    cors({
        origin: "*",
        method: ["POST", "GET"],
        credentials: true,
    })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
