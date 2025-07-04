'use client';
import {Modal,Container,Row} from "react-bootstrap";
import { toast } from "react-toastify";

export default function DeleteUser({ show, onHide, data, props }) {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
    
    const handleUserDelete = async () => {
     
        try {
            const response = await fetch(`${API_URL}users/${data}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`} 
            });
            
            if (response.ok) {
                toast("User deleted successfully.", {
                    theme: "dark",
                    position: "top-right",
                    type: "success"
                });
                onHide();
            } else {
                toast('Failed to delete user.', {
                    theme: "dark",
                    position: "top-right",
                    type: "error"
                });
            }
        } catch (error) {
            toast('Error deleting user.', {
                theme: "dark",
                position: "top-right",
                type: "error"
            });
            console.error('Error deleting user:', error);
        }
    };
    
    return(
        <>
        <Modal show={show} onHide={onHide} className="user_delete">
                <Modal.Header closeButton>
                  <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <div className="col-lg-12 col-md-12 col-12">
                                <p>Are you sure? You want to delete this user?</p>
                                <div className="btns">
                                    <button onClick={handleUserDelete} className="button" style={{backgroundColor:'red'}}>Delete</button>
                                    <button onClick={onHide} className="button" style={{backgroundColor:'gray'}}>Cancel</button>
                                </div>
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )

}