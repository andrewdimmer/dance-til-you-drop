import { Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import LoginUi from "../Content/LoginUi";

const LoginPage: React.FunctionComponent<PageProps> = ({
  setNotification,
  setPageKey,
  handleLoadUserData,
  classes,
}) => {
  const loginCallback = (authResult: firebase.auth.UserCredential) => {
    handleLoadUserData(
      authResult.user?.uid ? authResult.user.uid : "",
      authResult.user?.displayName ? authResult.user.displayName : "",
      authResult.user?.email ? authResult.user.email : "",
      authResult.user?.photoURL ? authResult.user.photoURL : ""
    );
    setPageKey("home");
    setNotification({
      type: "success",
      message: "Successfully Signed In",
      open: true,
    });
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Join or Login</Typography>
      </Container>
      <LoginUi
        allowEmailAuth={true}
        allowPhoneAuth={false}
        allowAnonymousAuth={false}
        newUserCallback={loginCallback}
        existingUserCallback={loginCallback}
        classes={classes}
      />
    </Fragment>
  );
};

export default LoginPage;
