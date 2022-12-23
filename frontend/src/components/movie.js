//a component to show the individual movie along with it's reviews
import React, { useState, useEffect } from "react";
import MovieDataSerivce from "../services/movies";
import { Link, useParams } from "react-router-dom";
import { Card, Container, Image, Col, Row, Button } from "react-bootstrap";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { parseISO } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Movie({ user }) {
  const { id } = useParams();

  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  const getMovieById = async (id) => {
    try {
      const response = await MovieDataSerivce.getMovieById(id);
      setMovie(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const deleteReview = async (reviewId, index) => {
    try {
      await MovieDataSerivce.deleteReview(reviewId, user.id);
      setMovie((prevState) => {
        prevState.reviews.splice(index, 1);
        return { ...prevState };
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMovieById(id);
  }, [id]);

  return (
    <div>
      <Container className="mt-5 mb-5">
        <Row md={2} sm={1}>
          <Col>
            <Image src={`${movie.poster}`} fluid width={"300"} />
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <b>The Plot:</b>
                </Card.Text>
                <Card.Text>{movie.fullplot}</Card.Text>
                {user && <Link to={`/movies/${id}/review`}>Add Review</Link>}
              </Card.Body>
            </Card>
            <br></br>
            <h2>Reviews</h2>
            <div
              id="scrollableDiv"
              style={{
                height: 300,
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              <InfiniteScroll
                dataLength={movie.reviews.length}
                next={movie.reviews}
                style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                inverse={true} //
                hasMore={true}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                {movie.reviews.map((review, index) => {
                  return (
                    <Card className="p-3 mt-3" key={index}>
                      <h5
                        style={{
                          fontSize: "1em",
                          color: "gray",
                          textAlign: "end",
                        }}
                      >
                        {review.name +
                          " reviewd " +
                          formatDistanceToNow(parseISO(review.date), {
                            addSuffix: true,
                          })}
                      </h5>
                      <hr />
                      <p>{review.review}</p>
                      <hr />
                      {user && user.id === review.user_id && (
                        <Row className="mt-3">
                          <Col>
                            <Button variant="danger">
                              <Link
                                state={{ currentReview: review }}
                                style={{
                                  color: "#fff",
                                  textDecoration: "none",
                                }}
                                to={`/movies/${id}/review`}
                              >
                                Edit
                              </Link>
                            </Button>
                          </Col>
                          <Col className="">
                            <Button
                              variant="danger"
                              onClick={() => deleteReview(review._id, index)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </Card>
                  );
                })}
              </InfiniteScroll>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
