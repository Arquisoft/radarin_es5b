import React from "react";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";

function BotonLogIn() {
  return (
    <SessionProvider sessionId="log-in-example">
      <LoginButton
        oidcIssuer="https://inrupt.net"
        onError={function noRefCheck() {}}
        redirectUrl="http://localhost:3000/"
      ></LoginButton>
    </SessionProvider>
  );
}

export default BotonLogIn;
