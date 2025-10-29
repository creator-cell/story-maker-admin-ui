'use client';
import { Modal, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "@/app/redux/UserStore";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
export default function DeleteUser({ show, onHide, data, props }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_USER;
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const handleUserDelete = async () => {

    try {
      const response = await axios({
        url: `${API_URL}/users/change-status/${data}`,
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: {
          status: 'inactive',
        }
      });
      if (response.data) {
        toast(t("Account delete successfully"), {
          theme: "dark",
          position: "top-right",
          type: "success"
        });

        dispatch(logout());
        router.push("/");

      }
    } catch (error) {
      console.log(error);
      toast(t("Unable to delete account"), {
        theme: "dark",
        position: "top-right",
        type: "error"
      });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} className="user_delete">
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <div className="col-lg-12 col-md-12 col-12">
                <p>Are you sure? You want to delete account? You will cant access the esim account if you click yes</p>
                <div className="btns">
                  <button onClick={handleUserDelete} className="button">Delete</button>
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