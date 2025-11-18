'use client';
import axios from "axios";
import {Modal,Container,Row} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function DeletePlan({ show, onHide, data, setLoader, props }) {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
      const { t } = useTranslation();
    
    const handlePlanDelete = async () => {
        axios({
            url: `${API_URL}billing-subscription/plan/${data}`,
            method: "DELETE",
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            toast(t("Plan delete successfully"), {
                theme:"light",
                position: "top-right",
                type: "success"
            });
            onHide();
        }).catch(err => {
            toast(t("Failed to delete Plan"), {
                theme:"light",
                position: "top-right",
                type: "error"
            });
        }).finally(() => {
            setLoader(false);
        });
    };
    
    return(
        <>
            <Modal show={show} onHide={onHide} className="user_delete">
                <Modal.Header closeButton>
                  <Modal.Title>{t("Delete Plan")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <div className="col-lg-12 col-md-12 col-12">
                                <p>{t("Are you sure? You want to delete this plan?")}</p>
                                <div className="btns">
                                    <button onClick={handlePlanDelete} className="button">{t("Delete")}</button>
                                    <button onClick={onHide} className="button">{t("Cancel")}</button>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}