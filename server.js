const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const engines = require("consolidate");
const swaggerUI = require("swagger-ui-express");
//const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require('dotenv');
const swaggerDocument = require('./swagger.json');
dotenv.config();
const cors = require("cors");
var compression = require("compression");
const app = express();
app.use(cors());
app.use(compression({
  level: 9
}));
app.use(compression({
  level: 9
}));

connectDB();
app.use(express.json({limit: '50mb'}));
app.use(express.json({ extended: false }));
app.use('/public', express.static('uploads'));

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");
const options = {
	definition: {
		openapi: "3.0.2",
		info: {
			title: "Mentor API",
			version: "1.0.0",
			description: "A node express mentor API",
		},
		servers: [
			{
				url: `${process.env.SITE_URL}/v1`,
			},
		],
	},
	apis: ["./routes/api/*.js"],
};
//const specs = swaggerJsDoc(options);

//app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/v1/adminLogin', require('./routes/api/admin/login'));
app.use('/v1/contentManagement', require('./routes/api/admin/contentManagement'));
app.use('/v1/transactions', require('./routes/api/admin/transaction'));

app.use('/v1/users', require('./routes/api/users'));
app.use('/v1/switchUser', require('./routes/api/switchUser'));
// app.use('/v1/subscriptions',require('./routes/api/subscriptions'));
app.use('/v1/create-payment-intent',require('./routes/api/stripePayment'));
// app.use('/v1/paypalPayment',require('./routes/api/paypalPayment'));
// app.use('/v1/subadmin', require('./routes/api/admin/subAdmin'));

//app.use('/v1',require('./routes/api/stripePayment'));
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));                                            

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
