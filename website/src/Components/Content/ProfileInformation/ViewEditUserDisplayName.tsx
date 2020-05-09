import { Fab, Grid, Paper, TextField, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import React, { Fragment } from "react";
import { updateUserProfileDatabase } from "../../../Scripts/firebaseUserDatabaseCalls";
import { PageProps } from "../../Pages";

const ViewEditUserDisplayName: React.FunctionComponent<PageProps> = ({
  currentUser,
  currentUserProfile,
  setNotification,
  handleLoadUserData,
  setLoadingMessage,
  classes,
}) => {
  const [displayName, setDisplayName] = React.useState<string>(
    currentUserProfile?.displayName ? currentUserProfile.displayName : ""
  );
  const [editing, setEditing] = React.useState(!displayName);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const cancelEditingDisplayName = () => {
    cancelEditing();
    setDisplayName(
      currentUserProfile?.displayName ? currentUserProfile.displayName : ""
    );
  };

  const saveDisplayName = () => {
    if (currentUser && currentUserProfile) {
      setLoadingMessage("Updating Display Name...");
      currentUser
        .updateProfile({ displayName })
        .then(() => {
          updateUserProfileDatabase(currentUserProfile.userId, { displayName })
            .then((value) => {
              if (value) {
                setNotification({
                  type: "success",
                  message: "Display Name Updated Successfully!",
                  open: true,
                });
                handleLoadUserData(currentUserProfile.userId);
                cancelEditing();
                setLoadingMessage("");
              } else {
                setNotification({
                  type: "warning",
                  message:
                    "Something may have gone wrong while updating your display name. It should fix itself, but if your new display name is not visiable after a few minutes, please try updating it again.",
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
                  "Something may have gone wrong while updating your display name. It should fix itself, but if your new display name is not visiable after a few minutes, please try updating it again.",
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
            message: "Unable to update display name. Please try again later.",
            open: true,
          });
          cancelEditing();
          setLoadingMessage("");
        });
    } else {
      setNotification({
        type: "error",
        message: "Unable to display name. Try signing out and signing back in.",
        open: true,
      });
    }
  };

  const handleDisplayNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDisplayName(event.target.value);
  };

  return (
    <Paper elevation={3} className={classes.marginedPadded}>
      <Typography variant="h4">Display Name</Typography>
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
                label="Enter Your Display Name:"
                value={displayName}
                onChange={handleDisplayNameChange}
                helperText="Please enter a display name."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  saveDisplayName();
                }}
                aria-label="save-display-name"
                id="profileTourStep3"
              >
                <DoneIcon />
              </Fab>
            </Grid>
            <Grid item xs={6} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  cancelEditingDisplayName();
                }}
                aria-label="cancel-edit-display-name"
              >
                <ClearIcon />
              </Fab>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={12} sm={10} md={11}>
              <Typography variant="h5">{displayName}</Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={1} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  startEditing();
                }}
                aria-label="edit-display-name"
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

export default ViewEditUserDisplayName;
