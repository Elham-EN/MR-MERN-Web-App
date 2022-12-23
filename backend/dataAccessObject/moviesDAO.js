//Movie data access object to allow our code to access movies in our database
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

//stores the reference to the database
let movies;

export default class MovieDAO {
  //injectDB is called as soon as the server starts and
  //provide the database reference to movies
  static async injectDB(conn) {
    //If the reference exists, exist the function
    if (movies) {
      return;
    }
    //Else we go ahead to connect to the database
    try {
      movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies");
    } catch (e) {
      console.error(`unable to connect in MoviesDAO: ${e.message}`);
    }
  }

  //To retrieve all movies from the database. The default filter has no filters, retrieve
  //results at page 0 and retrieves 20 movies per page.
  static async getMovies({ filters = null, page = 0, moviePerPage = 20 }) {
    let query;
    //Check if user specified filters in retrieval process
    if (filters) {
      //The 'in' operator checks if a specified property
      //exists in an object and return boolean value
      if ("title" in filters) {
        //Use $text query operator togther with $search to search for movies titles
        //containing the user specified search terms
        query = { $text: { $search: filters["title"] } };
      } else if ("rated" in filters) {
        //We check if the user specified value is equal to the value in the database
        //field query = {"rated": filters['raterd']}
        query = { rated: { $eq: filters["rated"] } };
      }
    }
    let cursor;
    try {
      //Why do we need a cursor?
      //Because our query can potentially match very large sets of documents, a cursor
      //fetches these documents in batches to reduce both memory consumption and network
      //bandwidth usage. We used limit method to cap the number of document returned as
      //specified. Using limit with skip allow us to implement pagination.
      cursor = await movies
        .find(query)
        .limit(moviePerPage)
        .skip(moviePerPage * page);
      //returns an array that contains all the documents from a cursor
      const moviesList = await cursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);
      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e.message}`);
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  static async getRatings() {
    let ratings = [];
    try {
      //To get all the distinct rated values from the movies collection
      ratings = await movies.distinct("rated");
      return ratings;
    } catch (e) {
      console.error(`unable to get ratings ${e.message}`);
    }
  }

  static async getMovieById(id) {
    try {
      return await movies
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "movieId",
              as: "reviews",
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getMovieById: ${e.message}`);
      throw e;
    }
  }
}

/**
 * Used aggregate to provide a sequence of data aggregation operations. In my case
 * the first operation $match, where we look for the movies document that matches
 * a specified id.
 *
 * Next used $lookup to perform an equality join using the _id field from the movie
 * document with the movie_id field from reviews collection.
 *
 * The $lookup stage has the following syntax:
 * {
 *   $lookup: {
 *              from: <collection to join>,
 *              localField: <field from the input document>,
 *              foreignField: <field from the documents of the "from" collection>,
 *              as: <output array field>
 *   }
 * }
 *
 * This finds all the reviews with the specific movie id and returns the specific
 * movie together with the reviews in an array.
 */
