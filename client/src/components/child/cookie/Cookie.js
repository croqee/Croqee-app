import React from 'react'
import CookieConsent from "react-cookie-consent";

export const Cookie = () => {
    return (
        <React.Fragment>
            <CookieConsent
                enableDeclineButton
                declineButtonText="x"
                declineButtonStyle={{ background: 'none', position: 'absolute', top: '-15px', right: '5px', color: '#ff3c00' }}
                flipButtons
                location="bottom"
                buttonText="I agree"
                cookieName="myAwesomeCookieName2"
                style={{ background: "#151515", padding: '10px', borderTop: '1px solid rgb(111 43 22)', opacity: '.9' }}
                buttonStyle={{ color: "white", background: "#ff3c00", fontSize: "13px", padding: '25px 104px', margin: '50px 0' }}
                expires={150}
            >
                This website stores data such as cookies to enable important site functionality including analytics, targeting, and personalization.
            </CookieConsent>
        </React.Fragment>
    )
}
