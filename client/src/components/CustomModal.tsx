import { FC } from "react";
import { Modal } from "react-bootstrap";
import { iSeats } from "../interface/seats";

interface iProps {
  onHideHandler: () => void;
  title: string;
  iconClass: string;
  iconColor: string;
  showFormData: boolean;
  CRN: number;
  email: string;
  name?: string;
  professor?: string;
  seats?: iSeats;
  bodyText: string;
}

const CustomModal: FC<iProps> = ({
  onHideHandler,
  title,
  iconClass,
  iconColor,
  showFormData,
  bodyText,
  CRN,
  email,
  name,
  professor,
  seats,
}) => {
  return (
    <>
      <Modal show={true} onHide={onHideHandler} backdrop="static">
        <Modal.Header closeButton>
          <h3>{title}</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i
              className={`fas ${iconClass} animate__animated animate__flipInX mt-3 mb-3`}
              style={{
                fontSize: 120,
                color: iconColor,
              }}
            />
          </div>
          {showFormData && (
            <div className="mt-3">
              <h6>Course CRN: {CRN}</h6>
              {name && <h6>Title: {name}</h6>}
              {professor && <h6>Professor: {professor}</h6>}
              {seats && (
                <h6>
                  Seats: {seats.remaining}/{seats.total}
                </h6>
              )}
              <h6>Email Address: {email}</h6>
            </div>
          )}
          <p
            className="mt-4 text-center"
            style={{ fontSize: 17.5, fontWeight: 400 }}
          >
            {bodyText}
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
