'use client';

import { useEffect, useState } from "react";

const ShowInstallModel = () => {
    const [show, setShow] = useState(false);
    const handleModelShow = () => {
        const expireDate = localStorage.getItem("expire");
        if (new Date() < new Date(Number(expireDate))) {
            return setShow(false);
        }
        localStorage.setItem("expire", Date.now() + (24 * 60 * 60 * 1000));
        setTimeout(() => {
            setShow(true);
        }, 25000);
    }

    useEffect(() => {
        handleModelShow();
    }, []);

    return (
        <>
            {/* <InstallApp show={show} onHide={() => setShow(false)}/> */}
        </>
    );
}

export default ShowInstallModel;