import express from "express";
import cors from "cors";
import moviesRouter from "./api/movie.route";

//Express application
const app = express();

//*Middlewares are functions that intercept incoing requests that comes to the express
//*application and out going response out of the express application. The use function
//*register a middleware with our express app.
//Cross-origin resources sharing, by default modern browswe don't allow frontend client
//to talk to REST APIS. They block requests sent from client to the server as a security
//mechanism to make sure that client-side browser Javascript code can only talk to their
//own allowed server and not to some other servers which can potentially run malicious
//code. To circumvent this security mechanism, we can enable CORS checking, a mechanism
//that uses additional HTTP headers to tell browsers to give a web application running at
//one origin, access to selected resources from a different origin.
app.use(cors());
//Parsing middleware to enable the server to read and accept JSON in a request's
//body. Iet us retrieve data from a request via the body attribute
app.use(express.json());

//The general convention for API urls is to begib with: '/api/<version number>
//every route in movies will start with /api/v1/movies.
app.use("/api/v1/movies", moviesRouter);

//If someone tries to go to a route that doesn't exist, the wild card route "*" return
//404 page with a not found message
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

//We then export app as a module so that other files can import it e.g. the file that
//accesses the database and starts the server. This allows us to separate our main server
//code from our database code.
export default app;
