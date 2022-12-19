import express from "express";
import MoviesController from "./movies.controller";
import ReviewsController from "./reviews.controller";

const moviesRouter = express.Router();

// "localhost:5000/api/v1/movies/"
moviesRouter.route("/").get(MoviesController.apiGetMovies);
// "localhost:5000/api/v1/movies/id/124D4fE4"
moviesRouter.route("/id/:id").get(MoviesController.apiGetMovieById);
// "localhost:5000/api/v1/movies/ratings" . This route return a list
// of movie ratings so that user can select ratings from a dropdown
// menu in the frontend application
moviesRouter.route("/ratings").get(MoviesController.apiGetRatings);

// "localhost:5000/api/v1/movies/reviews" for post, put and delete
moviesRouter.route("/reviews").post(ReviewsController.apiPostReview);
moviesRouter.route("/reviews").put(ReviewsController.apiUpdateReview);
moviesRouter.route("/reviews").delete(ReviewsController.apiDeleteReview);

export default moviesRouter;
