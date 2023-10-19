const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello, HireMe!");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
