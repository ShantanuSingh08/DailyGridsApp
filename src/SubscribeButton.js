import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

const SubscribeButton = () => {
    const planId = "P-3FL61243VG138730JM4356BY"; // Replace with your actual plan ID
  
    return (
      <div>
        <PayPalButtons
          style={{
            shape: "pill",
            color: "silver",
            layout: "vertical",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: planId,
            });
          }}
          onApprove={(data, actions) => {
            alert(`Subscription successful! Subscription ID: ${data.subscriptionID}`);
          }}
          onError={(err) => {
            console.error("PayPal Subscription Error: ", err);
            alert("An error occurred while processing your subscription. Please try again.");
          }}
        />
      </div>
    );
  };
  
export default SubscribeButton;
