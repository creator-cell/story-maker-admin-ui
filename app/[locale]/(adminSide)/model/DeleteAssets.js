"use client";
import axios from "axios";
import { Modal, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function DeleteAssets({ show, onHide, data, setLoader, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_ASSETS;
  const { t } = useTranslation();

  const handleAssetsDelete = async () => {
    setLoader(true);
    axios({
      url: `${API_URL}assets/${data}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast(t("Assets deleted successfully"), {
          theme: "light",
          position: "top-right",
          type: "success",
        });
        onHide();
      })
      .catch((err) => {
        toast(t("Failed to delete assets"),
          {
            theme: "light",
            position: "top-right",
            type: "error",
          }
        );
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} className="user_delete">
        <Modal.Header closeButton>
          <Modal.Title>{t("Delete Assets")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>{t("Are you sure? You want to delete this assets?")}</p>
                <div className="btns">
                  <button
                    onClick={handleAssetsDelete}
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
