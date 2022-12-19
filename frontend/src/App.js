import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MoviesList from "./components/movies-list";
import Movie from "./components/movie";
import AddReview from "./components/add-review";
import Login from "./components/login";
//Bootstrap components
import { Container, Nav, Navbar } from "react-bootstrap";

function App() {
  const [user, setUser] = useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div className="App">
      <Container fluid="md">
        <Navbar bg="danger" variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand className="logo" href="#home">
              Movie Reviews
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="mr-auto">
                <Nav.Link>
                  <Link className="font" to={"/movies"}>
                    Movies
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  {user ? (
                    <Link className="font" onClick={logout}>
                      Logout User
                    </Link>
                  ) : (
                    <Link className="font" to={"/login"}>
                      Login
                    </Link>
                  )}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path={"/movies"} element={<MoviesList />} />
          <Route path="movies/:id/review" element={<AddReview user={user} />} />
          <Route path="movies/:id/" element={<Movie user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
