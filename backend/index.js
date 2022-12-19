import app from "./server";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import MovieDAO from "./dataAccessObject/moviesDAO";
import ReviewsDAO from "./dataAccessObject/reviewsDAO";

//Connect to our MongoDB cluster and call functions to access our database
async function main() {
  //Load in the enviroment variables
  dotenv.config();
  const client = new MongoClient(process.env.MOVIEREVIEWS_DB_URI);
  const port = process.env.PORT || 8000;
  try {
    //Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected to the mongodb cluster");
    //After connecting to the db and before we start the express server, we call
    //injectDB to get our initial reference to the movies collectioni in the db
    await MovieDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    //Start Listeing to the server on port 5000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

main().catch(console.error);
