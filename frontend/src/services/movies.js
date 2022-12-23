import axios from "axios";

const urlMovies = "http://localhost:5000/api/v1/movies";

class MovieDataSerivce {
  //Return all the movies for a particular page (default page request is 0)
  getAllMovies(page = 0) {
    return axios.get(`${urlMovies}?page=${page}`);
  }

  //Get specific movie with the supplied id (use params :id)
  getMovieById(id) {
    return axios.get(`${urlMovies}/id/${id}`);
  }

  //Connect to the same endpoints as getAllMovies except that it has query
  //which consist of the user-entered search title, ratings and page number
  findMovie(query, by = "title", page = 0) {
    return axios.get(`${urlMovies}?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    return axios.post(`${urlMovies}/reviews`, data);
  }

  updateReview(data) {
    return axios.put(`${urlMovies}/reviews`, data);
  }

  deleteReview(id, userId) {
    return axios.delete(`${urlMovies}/reviews`, {
      data: { review_id: id, user_id: userId },
    });
  }

  getRatings() {
    return axios.get(`${urlMovies}/ratings`);
  }
}

export default new MovieDataSerivce();
