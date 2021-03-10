import React from "react";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";

function BotonLogIn() {
  return (
    <SessionProvider sessionId="log-in-example">
      <LoginButton
        oidcIssuer="https://inrupt.net"
        onError={function noRefCheck() {}}
        redirectUrl="https://solid-ui-react.docs.inrupt.com/iframe.html?id=authentication-login-button--with-children&viewMode=docs"
      ></LoginButton>
    </SessionProvider>
  );
}

export default BotonLogIn;
