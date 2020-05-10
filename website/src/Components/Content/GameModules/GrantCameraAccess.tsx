import { Button, Container, Grid, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import Webcam from "react-webcam";
import { NotificationMessage } from "../../Misc/Notifications";

declare interface GrantCameraAccessProps {
  setNotification: (notification: NotificationMessage) => void;
  nextStep: () => void;
  classes: any;
}

const GrantCameraAccess: React.FunctionComponent<GrantCameraAccessProps> = ({
  setNotification,
  nextStep,
  classes,
}) => {
  const [checking, setChecking] = React.useState<boolean>(false);

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h4">Grant Camera Access</Typography>
      </Container>
      <Grid container justify="center" spacing={2} direction="row">
        <Grid key="computer-access" xs={5} item>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            disabled={checking}
            onClick={() => {
              setChecking(true);
            }}
          >
            <Typography variant="h5">Grant Computer Camera Access</Typography>
          </Button>
        </Grid>
        <Grid key="phone-access" xs={5} item>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            disabled={checking}
            onClick={() => {}}
          >
            <Typography variant="h5">Grant Phone Camera Access</Typography>
          </Button>
        </Grid>
      </Grid>

      {checking && (
        <Webcam
          audio={false}
          mirrored={true}
          onUserMedia={() => {
            setChecking(false);
            nextStep();
            console.log("Loaded Camera!");
          }}
          onUserMediaError={() => {
            setChecking(false);
            setNotification({
              type: "warning",
              message: "Dance 'Til You Drop does not have access to a camera.",
              open: true,
            });
          }}
          videoConstraints={{ width: 0, height: 0 }}
          className={classes.fullSize}
        />
      )}
    </Fragment>
  );
};

export default GrantCameraAccess;
