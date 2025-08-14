"use client";
import { Modal, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ApproveTemplate({ show, onHide, data, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

  const handleUserDelete = async () => {
    try {
      const response = await fetch(`${API_URL}template/${data}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (response.ok) {
        toast("Template approved", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        onHide();
      } else {
        toast("Failed to approve template.", {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    } catch (error) {
      toast("Error approving template.", {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      console.error("Error approving template:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} className="user_delete">
        <Modal.Header closeButton>
          <Modal.Title>Approve Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>Are you sure? You want to approve this template?</p>
                <div className="btns">
                  <button
                    onClick={handleUserDelete}
                    className="button"
                    style={{ backgroundColor: "red" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={onHide}
                    className="button"
                    style={{ backgroundColor: "gray" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
