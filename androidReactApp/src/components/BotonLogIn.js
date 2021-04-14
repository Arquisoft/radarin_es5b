import { useState, useEffect } from "react";

import {
  useSession,
  CombinedDataProvider,
  Image,
  LogoutButton,
  LoginButton,
  Text,
  Value,
  SessionProvider,
} from "@inrupt/solid-ui-react";

import { Button, TextField, FormGroup, Container } from "@material-ui/core";

export default function LoginForm() {
  const [idp, setIdp] = useState("https://inrupt.net");
  const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");
  const { session } = useSession();

  
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [setCurrentUrl]);

  if (session.info.isLoggedIn){
    return (<div><h1>Logeado</h1>
    <LogoutButton onLogout={{}} onError={{}}>
       
      </LogoutButton></div>);
  
  }
   
    return(<LoginButton oidcIssuer={idp} redirectUrl={currentUrl}>


    </LoginButton>);

/*
  return (
    
    <Container fixed>
      <FormGroup>
        <TextField
          label="Identity Provider"
          placeholder="Identity Provider"
          type="url"
          value={idp}
          onChange={(e) => setIdp(e.target.value)}
          InputProps={{
            endAdornment: (

              <LoginButton oidcIssuer={idp} redirectUrl={currentUrl}>

                <Button variant="contained" color="primary">

                  Log&nbsp;in

                </Button>

              </LoginButton>

            ),
          }}
        />
      </FormGroup>
    </Container>
  );*/
}
