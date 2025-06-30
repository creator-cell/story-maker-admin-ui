
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Success() {
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;

  useEffect(() => {
    // First, try to get the selected plan from localStorage
    try {
      const planData = localStorage.getItem("selectedPlan");
      if (planData) {
        const parsedPlan = JSON.parse(planData);
        setSelectedPlan(parsedPlan);
        console.log("Retrieved plan from localStorage:", parsedPlan);
      }
    } catch (error) {
      console.error("Error retrieving plan from localStorage:", error);
    }

  
  }, [API_URL]);

 
  return (
    <>
      <div className="success">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="success_details">
                <div className="success_icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <span className="sub_title">Great</span>
                <span className="msg">Your ESIM is active now.</span>
                
                {/* Use selectedPlan data if available, otherwise fall back to order data */}
                {/* <span className="payment_status">
                  Payment received of <b>${selectedPlan?.price || order?.price || ''}</b>
                </span>
               <span className="payment_status">
                  Purchased order is <b>{selectedPlan?.name || ''}</b>
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
