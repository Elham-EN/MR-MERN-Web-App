import ReviewsDAO from "../dataAccessObject/reviewsDAO";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const review = req.body.review;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id,
      };
      const date = new Date();
      const ReviewResponse = await ReviewsDAO.addReview(
        movieId,
        userInfo,
        review,
        date
      );
      res.status(201).json({ status: "Successfully created" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const review = req.body.review;
      const date = new Date();
      const ReviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        review,
        date
      );
      const { error } = ReviewResponse;
      if (error) {
        res.status(404).json({ error: error });
      }
      //If modifiedCount is 0, it means the review has not been updated
      if (ReviewResponse.modifiedCount === 0) {
        throw new Error("Unable to update review. User may not be original");
      }
      res.status(200).json({ status: "Successfully updated" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;
      const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
      res.status(200).json({ status: "Successfully deleted" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
