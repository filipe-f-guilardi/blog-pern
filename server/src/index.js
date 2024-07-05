require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

require("./routes/auth.routes")(app);
require("./routes/users.routes")(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
