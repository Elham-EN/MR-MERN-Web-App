import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Login(props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeId = (e) => {
    const id = e.target.value;
    setId(id);
  };

  const login = () => {
    props.login({ name: name, id: id });
    navigate("/");
  };

  return (
    <Container className="w-50 mt-5 form-box">
      <Form className="w-50 mx-auto">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={onChangeName}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter id"
            value={id}
            onChange={onChangeId}
          />
        </Form.Group>
        <Button className="w-100" variant="primary" onClick={login}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
