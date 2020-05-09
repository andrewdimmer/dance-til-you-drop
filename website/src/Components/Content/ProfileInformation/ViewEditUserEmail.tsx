import { Fab, Grid, Paper, TextField, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React, { Fragment } from "react";
import { updateUserProfileDatabase } from "../../../Scripts/firebaseUserDatabaseCalls";
import { PageProps } from "../../Pages";

const ViewEditUserEmail: React.FunctionComponent<PageProps> = ({
  currentUser,
  currentUserProfile,
  setNotification,
  handleLoadUserData,
  setLoadingMessage,
  classes,
}) => {
  const [email, setEmail] = React.useState<string>(
    currentUserProfile?.email ? currentUserProfile.email : ""
  );
  const [editing, setEditing] = React.useState(!email);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const cancelEditingEmail = () => {
    cancelEditing();
    setEmail(currentUserProfile?.email ? currentUserProfile.email : "");
  };

  const saveEmail = () => {
    if (currentUser && currentUserProfile) {
      setLoadingMessage("Updating Email Address...");
      currentUser
        .updateEmail(email)
        .then(() => {
          updateUserProfileDatabase(currentUserProfile.userId, { email })
            .then((value) => {
              if (value) {
                setNotification({
                  type: "success",
                  message: "Email Address Updated Successfully!",
                  open: true,
                });
                handleLoadUserData(currentUserProfile.userId);
                cancelEditing();
                setLoadingMessage("");
              } else {
                setNotification({
                  type: "warning",
                  message:
                    "Something may have gone wrong while updating your email address. It should fix itself, but if your new email address is not visiable after a few minutes, please try updating it again.",
                  open: true,
                });
                cancelEditing();
                setLoadingMessage("");
              }
            })
            .catch((err) => {
              console.log(err);
              setNotification({
                type: "warning",
                message:
                  "Something may have gone wrong while updating your email address. It should fix itself, but if your new email address is not visiable after a few minutes, please try updating it again.",
                open: true,
              });
              cancelEditing();
              setLoadingMessage("");
            });
        })
        .catch((err: any) => {
          console.log(err);
          setNotification({
            type: "error",
            message: `Unable to update email address. ${
              err.message ? err.message : "Please try again later."
            }`,
            open: true,
          });
          cancelEditing();
          setLoadingMessage("");
        });
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to email address. Try signing out and signing back in.",
        open: true,
      });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Paper
      elevation={3}
      className={classes.marginedPadded}
      id="profileTourStep4"
    >
      <Typography variant="h4">Email Address</Typography>
      <Typography variant="body1">
        Note this is also your username into Dance Til You Drop.
      </Typography>
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
                label="Enter Your Email Address:"
                value={email}
                onChange={handleEmailChange}
                helperText="Please enter a valid email address."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  saveEmail();
                }}
                aria-label="save-email"
                id="profileTourStep5"
              >
                <DoneIcon />
              </Fab>
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  cancelEditingEmail();
                }}
                aria-label="cancel-edit-email"
                id="profileTourStep5"
              >
                <ClearIcon />
              </Fab>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={12} sm={10} md={11}>
              <Typography variant="h5">{email}</Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  startEditing();
                }}
                aria-label="edit-email"
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

export default ViewEditUserEmail;
