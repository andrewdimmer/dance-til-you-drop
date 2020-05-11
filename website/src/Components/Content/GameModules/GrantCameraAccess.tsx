import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Webcam from "react-webcam";
import { UserProfile } from "../../../Scripts/firebaseUserTypes";
import { NotificationMessage } from "../../Misc/Notifications";
import qrcode from "qrcode-generator";

declare interface GrantCameraAccessProps {
  setNotification: (notification: NotificationMessage) => void;
  nextStep: () => void;
  classes: any;
  currentUserProfile: UserProfile | null;
}

const GrantCameraAccess: React.FunctionComponent<GrantCameraAccessProps> = ({
  setNotification,
  nextStep,
  classes,
  currentUserProfile,
}) => {
  const [checking, setChecking] = React.useState<boolean>(false);
  const [qrcodeOpen, setQRCodeOpen] = React.useState(false);
  const qrcodeRef = React.useRef<HTMLDivElement>(null);

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
            disabled={checking || !currentUserProfile}
            onClick={() => {
              setQRCodeOpen(true);
            }}
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

      <Dialog
        open={qrcodeOpen}
        onClose={() => {
          setQRCodeOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Pair a Mobile Device.</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Just scan the QR code below with the Dance 'Til You Drop Flutter App
            to start the sync.
          </Typography>
          <div ref={qrcodeRef} />
          {(() => {
            if (currentUserProfile) {
              const qr = qrcode(4, "L");
              qr.addData(currentUserProfile.userId);
              qr.make();
              setTimeout(() => {
                if (qrcodeRef.current) {
                  qrcodeRef.current.innerHTML = qr.createImgTag();
                }
              }, 100);
            }
          })()}
          {}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setQRCodeOpen(false);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default GrantCameraAccess;
