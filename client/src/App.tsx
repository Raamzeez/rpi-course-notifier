import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import React, { ChangeEvent, FC, FormEvent, useState, useEffect } from "react";
import { Row, Col, Form, Button, Card, ProgressBar } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { iError } from "./interface/error";
import axios from "axios";
import shortid from "shortid";
import CustomModal from "./components/CustomModal";
import Footer from "./components/Footer";
import { iCourse } from "./interface/course";

const App: FC = () => {
  // const variants = ["primary, success, danger, warning, info, secondary"];

  useEffect(() => {
    const useDarkMode = localStorage.getItem("darkmode");
    if (!useDarkMode) {
      return localStorage.setItem("darkmode", "false");
    }
    if (useDarkMode === "true") {
      return setState({ ...state, darkMode: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeDarkMode = () => {
    setState({ ...state, darkMode: !state.darkMode });
    return localStorage.setItem("darkmode", (!state.darkMode).toString());
  };

  interface iState {
    email: string;
    CRN: number;
    loading: boolean;
    error: iError | null;
    success: boolean;
    courseData: iCourse | null;
    darkMode: boolean;
  }

  const [state, setState] = useState<iState>({
    email: "",
    CRN: 0,
    loading: false,
    error: null,
    success: false,
    courseData: null,
    darkMode: false,
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const onSubmit: React.FormEventHandler = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();
      setState({ ...state, loading: true });
      const response = await axios.post(
        "http://localhost:5000/formSubmit",
        state,
        { validateStatus: () => true }
      );
      if (response.status !== 200) {
        return setState({
          ...state,
          loading: false,
          error: response.data,
          success: false,
        });
      }
      return setState({
        ...state,
        loading: false,
        error: null,
        success: true,
        courseData: response.data,
      });
    } catch (err) {
      return setState({
        ...state,
        loading: false,
        error: {
          name: "Backend Server Fail",
          message: "Unable to access our servers please try again later.",
        },
        success: false,
      });
    }
  };

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: state.darkMode ? "rgb(30, 30, 30)" : "white",
      }}
    >
      <ToastContainer />
      <Row>
        <Col>
          <div className="text-center">
            <h1
              style={{
                marginTop: 30,
                color: state.darkMode ? "white" : "black",
              }}
            >
              RPI Course Notifier
            </h1>
            <p
              className="mt-4"
              style={{ color: state.darkMode ? "white" : "black" }}
            >
              Our software allows you to receive emails regarding whether or not
              a seat in a class has become available. It's extremely simple.
              Just sign up with the form, and you are done!
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="text-center">
            <Button
              className="circularButton"
              variant={state.darkMode ? "light" : "dark"}
              onClick={changeDarkMode}
            >
              <i className="fas fa-adjust" style={{ fontSize: 30 }} />
            </Button>
            <a
              rel="noreferrer"
              target="_blank"
              href="mailto:abbasm3@rpi.edu?subject=Inquiry&body=Hello!%20I%20had%20a%20question%20about%20your%20RPI%20Course%20Notifier%20software.%20"
            >
              {" "}
              <Button
                className="circularButton"
                style={{
                  marginLeft: 30,
                  backgroundColor: state.darkMode
                    ? "rgb(255, 120, 52)"
                    : "rgb(52, 120, 255)",
                  border: "none",
                }}
              >
                <i
                  className="fas fa-envelope-open-text"
                  style={{ fontSize: 30 }}
                />
              </Button>
            </a>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ProgressBar className="mt-3">
            {/* {variants.map((variant: string) => {
              return ( */}
            <ProgressBar
              animated
              striped
              // variant={variant}
              variant={state.darkMode ? "danger" : "info"}
              // now={20}
              now={100}
              key={shortid()}
            />
            {/* );
            })} */}
          </ProgressBar>
        </Col>
      </Row>
      <Row>
        <Col>
          {state.error && (
            <>
              <CustomModal
                onHideHandler={() => setState({ ...state, error: null })}
                title={`(${state.error.status ? state.error.status : 404}) - ${
                  state.error.name
                }`}
                iconClass="fa-times-circle"
                iconColor="red"
                showFormData={false}
                CRN={state.CRN}
                email={state.email}
                bodyText={state.error.message}
                darkMode={state.darkMode}
              />
            </>
          )}
          {state.success && (
            <>
              <CustomModal
                onHideHandler={() => setState({ ...state, success: false })}
                title="Success!"
                iconClass="fa-check-circle"
                iconColor="rgb(52, 199, 122)"
                showFormData={true}
                CRN={state.CRN}
                email={state.email}
                name={state.courseData?.title}
                seats={{
                  total: state.courseData?.sections[0].cap as number,
                  remaining: state.courseData?.sections[0].rem as number,
                }}
                bodyText="You will receive a confirmation email which includes further instructions"
                darkMode={state.darkMode}
              />
            </>
          )}
          {!state.loading && !state.success && (
            <>
              <Card
                className="card mt-5 shadow-sm"
                style={{
                  backgroundColor: state.darkMode
                    ? "rgb(140, 140, 140)"
                    : "white",
                }}
              >
                <Form onSubmit={onSubmit}>
                  <div className="text-center">
                    <Form.Group
                      className="mb-5 mt-3"
                      controlId="formBasicEmail"
                    >
                      <Form.Label
                        style={{ color: state.darkMode ? "white" : "black" }}
                      >
                        Email address
                      </Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        value={state.email}
                        name="email"
                        pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"
                        onChange={onChange}
                        style={{ width: "60%", margin: "auto" }}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-5 mt-3"
                      controlId="formBasicEmail"
                    >
                      <Form.Label
                        style={{ color: state.darkMode ? "white" : "black" }}
                      >
                        Course CRN
                      </Form.Label>
                      <Form.Control
                        required
                        type="number"
                        placeholder="123456"
                        value={state.CRN}
                        name="CRN"
                        onChange={onChange}
                        style={{ width: "60%", margin: "auto" }}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="submitButton mb-3"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </Card>
            </>
          )}
          {state.loading && (
            <>
              <div style={{ marginLeft: "43%", marginTop: "5%" }}>
                <ClipLoader color={"skyblue"} size={200} />
              </div>
              <h3
                style={{
                  marginTop: 100,
                  color: state.darkMode ? "white" : "black",
                }}
                className="text-center"
              >
                We are processing your information...
              </h3>
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Footer darkMode={state.darkMode} />{" "}
        </Col>
      </Row>
    </div>
  );
};

export default App;
