'use client';
import axios from "axios";
import {Modal,Container,Row} from "react-bootstrap";
import { toast } from "react-toastify";

export default function DeletePlan({ show, onHide, data, setLoader, props }) {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_PLANS;
    
    const handlePlanDelete = async () => {
        setLoader(true);
        axios({
            url: `${API_URL}plan/${data}`,
            method: "DELETE",
            headers: {
                "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            toast(res.data?.message || "Plan delete successfully.", {
                theme:"light",
                position: "top-right",
                type: "success"
            });
            onHide();
        }).catch(err => {
            toast(err?.response?.data?.errors?.[0]?.message ?? err?.response?.data?.message ?? "Failed to delete Plan", {
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
                  <Modal.Title>Delete Plan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <div className="col-lg-12 col-md-12 col-12">
                                <p>Are you sure? You want to delete this plan?</p>
                                <div className="btns">
                                    <button onClick={handlePlanDelete} className="button">Delete</button>
                                    <button onClick={onHide} className="button">Cancel</button>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}