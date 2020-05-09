import firebase from "firebase";
import * as firebaseui from "firebaseui";
import React, { Fragment } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { signInSuccessWithAuthResultFactory } from "../../Scripts/firebaseAuth";
import { firebaseApp } from "../../Scripts/firebaseConfig";

declare interface LoginUiProps {
  allowEmailAuth: boolean;
  allowPhoneAuth: boolean;
  allowAnonymousAuth: boolean;
  newUserCallback: (authResults: firebase.auth.UserCredential) => void;
  existingUserCallback: (authResults: firebase.auth.UserCredential) => void;
  classes: any;
}

const LoginUi: React.FunctionComponent<LoginUiProps> = ({
  allowEmailAuth,
  allowPhoneAuth,
  allowAnonymousAuth,
  newUserCallback,
  existingUserCallback,
}) => {
  const signInOptions = (allowAnonymousAuth: boolean): any[] => {
    const signInOptionsArray = [];
    if (allowEmailAuth) {
      signInOptionsArray.push({
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      });
    }
    if (allowPhoneAuth) {
      signInOptionsArray.push({
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: "image", // 'audio'
          size: "invisible", // 'normal' or 'compact'
          badge: "bottomleft", //' bottomright' or 'inline' applies to invisible.
        },
      });
    }
    if (allowAnonymousAuth) {
      signInOptionsArray.push({
        provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      });
    }
    return signInOptionsArray;
  };

  const signInSuccessWithAuthResult = signInSuccessWithAuthResultFactory(
    newUserCallback,
    existingUserCallback
  );

  const uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult,
    },
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: signInOptions(allowAnonymousAuth),
    signInSuccessUrl: window.location.href,
  };

  return (
    <Fragment>
      <div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebaseApp.auth()}
        />
      </div>
    </Fragment>
  );
};

export default LoginUi;
