import { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";

interface iProps {
  darkMode: boolean;
}

const Footer: FC<iProps> = ({ darkMode }) => {
  return (
    <div
      className="footer text-center"
      style={{
        backgroundColor: darkMode ? "rgb(60, 60, 60)" : "rgb(246, 247, 249)",
      }}
    >
      <Container>
        <Row>
          <Col className="text-center mt-4">
            <h4 className={darkMode ? "text-white" : "text-dark"}>
              Powered by{" "}
            </h4>
            <img
              src="https://quacs.org/fall2021/img/quacs_logo_white_duck.0544db91.svg"
              height={"30%"}
              width={"30%"}
              alt="Logo of Quacs"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
