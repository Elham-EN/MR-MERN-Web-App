//A component to list movies
import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
//Bootstrap components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("");
  //When user first come to the Movies List Search form, the default
  //value for search by rating is 'All Ratings'
  const [ratings, setRatings] = useState(["All Ratings"]);

  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);

  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  useEffect(() => {
    retrieveMovies();
  }, [currentPage]);

  const retrieveMovies = async () => {
    try {
      const response = await MovieDataService.getAllMovies(currentPage);
      setMovies(response.data.movies);
      setCurrentPage(response.data.page);
      setEntriesPerPage(response.data.entries_per_page);
    } catch (e) {
      console.log(e.message);
    }
  };

  const retrieveRatings = async () => {
    try {
      const response = await MovieDataService.getRatings();
      //Start with 'All Ratings' if user doesn't specify any ratings
      setRatings(["All Ratings", ...response.data]);
    } catch (e) {
      console.log(e.message);
    }
  };

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const onChangeSearchRating = (e) => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  };

  //Simply provide the search query value entered by the user
  const find = async (query, by) => {
    try {
      const response = await MovieDataService.findMovie(query, by);
      setMovies(response.data.movies);
    } catch (e) {
      console.log(e.message);
    }
  };

  const findByTitle = () => {
    find(searchTitle, "title");
  };

  const findByRating = () => {
    if (searchRating === "All Ratings") {
      retrieveMovies();
    } else {
      find(searchRating, "rated");
    }
  };

  return (
    <div className="App">
      <Container fluid className="mt-3">
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
              <Button
                className="w-100"
                variant="danger"
                type="button"
                onClick={findByTitle}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Select
                  aria-label="select rating"
                  onChange={onChangeSearchRating}
                >
                  {ratings.map((rating, index) => {
                    return (
                      <option key={rating + index} value={rating}>
                        {rating}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
              <Button
                className="w-100"
                variant="danger"
                type="button"
                onClick={findByRating}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mt-5">
          {movies.map((movie, index) => {
            // if (movie.poster) {
            return (
              <Col
                className="mt-3 mb-3 mx-auto"
                md="auto"
                sm="auto"
                xs="auto"
                key={index + movie}
              >
                <Card style={{ width: "18rem", height: "100%" }}>
                  <Card.Img
                    style={{ height: "380px" }}
                    variant="top"
                    src={`${movie.poster}/100px180"`}
                  />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>Rating: {movie.rated}</Card.Text>
                    <Card.Text>{movie.plot}</Card.Text>
                    <Link to={`/movies/${movie._id}`}>View Reviews</Link>
                  </Card.Body>
                </Card>
              </Col>
            );
            //}
          })}
        </Row>
        <br />
        <div
          style={{
            display: "flex",
            gap: "30px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <p className="mt-2">Showing page: {currentPage}</p>
          <Button
            className="mb-5"
            variant="danger"
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            Get next {entriesPerPage} results
          </Button>
        </div>
      </Container>
    </div>
  );
}
