import { Fab, Grid, Paper, TextField, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React, { Fragment } from "react";
import { PageProps } from "../../Pages";

const ViewEditUserPassword: React.FunctionComponent<PageProps> = ({
  currentUser,
  setNotification,
  setLoadingMessage,
  classes,
}) => {
  const [password, setPassword] = React.useState<string>("");
  const [password2, setPassword2] = React.useState<string>("");
  const [editing, setEditing] = React.useState(false);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const cancelEditingPassword = () => {
    cancelEditing();
    setPassword("");
    setPassword2("");
  };

  const savePassword = () => {
    if (currentUser) {
      if (password === password2) {
        setLoadingMessage("Updating Password...");
        currentUser
          .updatePassword(password)
          .then(() => {
            setNotification({
              type: "success",
              message: "Password Updated Successfully!",
              open: true,
            });
            cancelEditingPassword();
            setLoadingMessage("");
          })
          .catch((err: any) => {
            console.log(err);
            setNotification({
              type: "error",
              message: `Unable to update password. ${
                err.message ? err.message : "Please try again later."
              }`,
              open: true,
            });
            cancelEditingPassword();
            setLoadingMessage("");
          });
      } else {
        setNotification({
          type: "error",
          message: "Unable to update password. Passwords do not match.",
          open: true,
        });
      }
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to update password. Try signing out and signing back in.",
        open: true,
      });
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handlePassword2Change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword2(event.target.value);
  };

  return (
    <Paper elevation={3} className={classes.marginedPadded}>
      <Typography variant="h4">Password</Typography>
      <Grid
        container
        spacing={2}
        alignItems="center"
        className={classes.profileViewEditGrid}
      >
        {editing ? (
          <Fragment>
            <Grid item xs={12} sm={8} md={10}>
              <TextField
                fullWidth
                label="Enter a New Password:"
                value={password}
                onChange={handlePasswordChange}
                helperText="Please enter a new password."
                variant="outlined"
                type="password"
              />
              <TextField
                fullWidth
                label="Confirm Your Password:"
                value={password2}
                onChange={handlePassword2Change}
                helperText="Please confirm your new password."
                variant="outlined"
                type="password"
              />
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  savePassword();
                }}
                aria-label="save-password"
              >
                <DoneIcon />
              </Fab>
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  cancelEditingPassword();
                }}
                aria-label="cancel-edit-password"
              >
                <ClearIcon />
              </Fab>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={12} sm={10} md={11}>
              <Typography variant="h5">************</Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  startEditing();
                }}
                aria-label="edit-password"
                id="profileTourStep9"
              >
                <EditIcon />
              </Fab>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Paper>
  );
};

export default ViewEditUserPassword;
