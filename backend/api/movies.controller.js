import MovieDAO from "../dataAccessObject/moviesDAO";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const moviesPerPage = req.query.moviesPerPage
      ? parseInt(req.query.moviesPerPage)
      : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    let filters = {};
    if (req.query.rated) {
      filters.rated = req.query.rated;
    } else if (req.query.title) {
      filters.title = req.query.title;
    }
    const { moviesList, totalNumMovies } = await MovieDAO.getMovies({
      filters,
      page,
      moviesPerPage,
    });
    let response = {
      movies: moviesList,
      page: page,
      filters: filters,
      enteries_per_page: moviesPerPage,
      total_result: totalNumMovies,
    };
    res.json(response);
  }

  static async apiGetMovieById(req, res, next) {
    try {
      //http://localhost:8000/movies/:id
      let id = req.params.id || {};
      let movie = await MovieDAO.getMovieById(id);
      if (!movie) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.status(200).json(movie);
    } catch (e) {
      console.error(`api, ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetRaitngs(req, res, next) {
    try {
      let propertyTypes = await MovieDAO.getRatings();
      res.status(200).json(propertyTypes);
    } catch (e) {
      console.error(`api ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  }
}
