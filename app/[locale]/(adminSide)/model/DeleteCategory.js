"use client";
import { Modal, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function DeleteCategory({ show, onHide, data, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_CATEGORY;
  const { t } = useTranslation();

  const handleUserDelete = async () => {
    try {
      const response = await fetch(`${API_URL}category/${data}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        toast("Category deleted successfully.", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        onHide();
      } else {
        toast("Failed to delete role.", {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    } catch (error) {
      toast("Error deleting role.", {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      console.error("Error deleting role:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} className="user_delete">
        <Modal.Header closeButton>
          <Modal.Title>{t("Delete Category")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>{t("Are you sure? You want to delete this category?")}</p>
                <div className="btns">
                  <button
                    onClick={handleUserDelete}
                    className="button"
                  >
                    {t("Delete")}
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
