// src/components/SubscriptionPage.js
import React, { useState } from 'react';
import './SubscriptionPage.css';
import WaterWave from 'react-water-wave';
import { useRipple } from './RippleContext';
import SubscribeButton from './SubscribeButton';


const SubscriptionPage = ({ bgImage }) => {
    const { isRippleEnabled } = useRipple();
    const [showSubscribeButton, setShowSubscribeButton] = useState(false);

    const handleSubscribeClick = () => {     
        setShowSubscribeButton(true); // Show the SubscribeButton component
    };

    return (
        <>
      {isRippleEnabled ? (
        <WaterWave
          imageUrl={bgImage}
          style={{ width: '100%', height: '100%', backgroundSize: 'cover' }}
        >
          {({ pause, play }) => (
        <div className="subscription-page">
            <h1>DailyGrids Subscription</h1>
            <p>Upgrade your experience with premium features!</p>

            <div className="subscription-options">
                <div className="subscription-tier">
                    <h2>Free Plan</h2>
                    <p>Basic access to DailyGrids features.</p>
                    <ul>
                        <li>Up to 3 appointments</li>
                        <li>Up to 3 notes</li>
                    </ul>
                </div>

                <div className="subscription-tier premium">
                    <h2>Premium Plan</h2>
                    <p>Unlock more tools for maximum productivity.</p>
                    <ul>
                        <li>Unlimited appointments</li>
                        <li>Unlimited notes</li>
                        <li>Email reminders for appointments</li>
                        <li>Access to Zen mode</li>
                        <li>Exclusive prerelease features</li>
                    </ul>
                    <SubscribeButton/>

                    <button className="subscribe-button" onClick={handleSubscribeClick}>
                            Go Premium Now  $3.99/month
                    </button>
                    <SubscribeButton/>
                </div>
            </div>
        </div>
      )}
      </WaterWave>
    ) : (
        <div className="subscription-page"
        style={{backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          width: '100%',
          height: '100%'}}>
        <h1>DailyGrids Subscription</h1>
        <p id='subscription'>Upgrade your experience with premium features!</p>

        <div className="subscription-options">
            <div className="subscription-tier">
                <h2>Free Plan</h2>
                <p>Basic access to DailyGrids features.</p>
                <ul>
                    <li>Up to 3 appointments</li>
                    <li>Up to 3 notes</li>
                </ul>
            </div>

            <div className="subscription-tier premium">
                <h2 id='subscription'>Premium Plan</h2>
                <p id='subscription'>Unlock more tools for maximum productivity.</p>
                <ul>
                    <li>Unlimited appointments</li>
                    <li>Unlimited notes</li>
                    <li>Email reminders for appointments</li>
                    <li>Access to Zen mode</li>
                    <li>Exclusive prerelease features</li>
                </ul>
                {showSubscribeButton ? (
                        <SubscribeButton />
                    ) : (
                        <button className="subscribe-button" onClick={handleSubscribeClick}>
                            Go Premium Now $3.99/month
                        </button>
                    )}

            </div>
        </div>
    </div>
        )}
        </>
      );
    };

export default SubscriptionPage;
