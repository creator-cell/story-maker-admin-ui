"use client";
import { Modal, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function ApproveTemplate({ show, onHide, data, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const { t } = useTranslation();

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
        toast(t("Template approved"), {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        onHide();
      } else {
        toast(t("Failed to approve template"), {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    } catch (error) {
      toast(t("Error approving template"), {
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
          <Modal.Title>{t("Approve Template")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>{t("Are you sure? You want to approve this template?")}</p>
                <div className="btns">
                  <button
                    onClick={handleUserDelete}
                    className="button"
                  >
                    {t("Approve")}
                  </button>
                  <button
                    onClick={onHide}
                    className="button"
                  >
                    {t("Cancel")}
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
