//a component to add review
import React, { useState } from "react";
import MovieDataService from "../services/movies";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

export default function AddReview(props) {
  let editing = false;
  let initialReviewState = "";

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.review;
  }

  const [review, setReview] = useState(initialReviewState);
  //Keep track if review is submitted
  const [submitted, setSubmitted] = useState(false);

  const onChangeReview = (e) => {
    const review = e.target.value;
    setReview(review);
  };

  const saveReview = async () => {
    let data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: id,
    };

    try {
      if (editing) {
        //Get existing review id
        data.review_id = location.state.currentReview._id;
        await MovieDataService.updateReview(data);
        setSubmitted(true);
      } else {
        await MovieDataService.createReview(data);
        setSubmitted(true);
      }
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Container className="w-50 mt-5 form-box">
      {submitted ? (
        <>
          <h4 style={{ textAlign: "center" }}>Review submitted successfully</h4>
          <p className="mt-3" style={{ textAlign: "center" }}>
            {" "}
            Will be directed back to the movie in 3 seconds
          </p>
        </>
      ) : (
        <Form>
          <Form.Group>
            <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              placeholder="Write your review"
              value={review}
              onChange={onChangeReview}
            />
          </Form.Group>
          <Button className="mt-5 w-100" variant="danger" onClick={saveReview}>
            Submit
          </Button>
        </Form>
      )}
    </Container>
  );
}
