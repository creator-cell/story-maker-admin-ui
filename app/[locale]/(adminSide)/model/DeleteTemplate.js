"use client";
import { Modal, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
export default function DeleteTemplate({ show, onHide, data, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const router = useRouter();
  const { t } = useTranslation();

  const handleUserDelete = async () => {
    try {
      const response = await fetch(`${API_URL}template/${data}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        toast("Template deleted successfully.", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        onHide();
        router.push("/admin/template");
      } else {
        toast("Failed to delete template.", {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    } catch (error) {
      toast("Error deleting template.", {
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
          <Modal.Title>{t("Delete Template")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>{t("Are you sure? You want to delete this template?")}</p>
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
