import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { firebaseApp } from "../Scripts/firebaseConfig";
import { getCreateUserProfileDatabase } from "../Scripts/firebaseUserDatabaseCalls";
import { UserProfile } from "../Scripts/firebaseUserTypes";
import { styles } from "../Styles";
import NavBar from "./Layouts/NavBar";
import LoadingScreen from "./Misc/LoadingScreen";
import NotificationBar, { NotificationMessage } from "./Misc/Notifications";
import { getPageComponent, getPageTitle } from "./Pages";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  const [notification, setNotification] = React.useState<NotificationMessage>({
    type: "info",
    message: "",
    open: false,
  });
  const [loadingMessage, setLoadingMessage] = React.useState<string>("");
  const [pageKey, setPageKey] = React.useState<string>("home");
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(
    null
  );
  const [
    currentUserProfile,
    setCurrentUserProfile,
  ] = React.useState<UserProfile | null>(null);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const PageContent = getPageComponent(pageKey);
  const classes = styles();

  const handleLoadUserData = (
    userId: string,
    displayName?: string,
    email?: string,
    photoURL?: string
  ) => {
    if (userId) {
      setLoadingMessage("Loading Data...");
      getCreateUserProfileDatabase(userId, displayName, email, photoURL)
        .then((data) => {
          setCurrentUserProfile(data);
          setCurrentUser(firebaseApp.auth().currentUser);
          setLoadingMessage("");
        })
        .catch(() => {
          setNotification({
            type: "error",
            message: "Unable to get User Data... Please try again later.",
            open: true,
          });
          setCurrentUserProfile(null);
          setCurrentUser(null);
          setLoadingMessage("");
        });
    } else {
      setCurrentUserProfile(null);
      setCurrentUser(null);
    }
  };

  if (!loaded) {
    const listener = firebaseApp.auth().onAuthStateChanged((user) => {
      setLoaded(true);
      handleLoadUserData(user ? user.uid : "");
      listener();
    });
  }

  return (
    <Fragment>
      <NavBar
        pageTitle={getPageTitle(pageKey)}
        setPageKey={setPageKey}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUserProfile={currentUserProfile}
      />
      <Container className={classes.marginedTopBottom}>
        <PageContent
          setPageKey={setPageKey}
          setLoadingMessage={setLoadingMessage}
          setNotification={setNotification}
          handleLoadUserData={handleLoadUserData}
          currentUser={currentUser}
          currentUserProfile={currentUserProfile}
          classes={classes}
        />
        {pageKey !== "home" && pageKey !== "play" && (
          <Button
            color="primary"
            fullWidth
            variant="outlined"
            size="large"
            className={classes.marginedTopBottom}
            onClick={() => {
              setPageKey("home");
            }}
          >
            <Typography variant="h4">Return to Home</Typography>
          </Button>
        )}
      </Container>
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
    </Fragment>
  );
};

export default App;
