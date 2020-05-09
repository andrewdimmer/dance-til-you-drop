import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";
import firebase from "firebase";
import { DropzoneArea } from "material-ui-dropzone";
import React, { Fragment } from "react";
import { profilePicturesRef } from "../../../Scripts/firebaseConfig";
import { updateUserProfileDatabase } from "../../../Scripts/firebaseUserDatabaseCalls";
import { UserProfile } from "../../../Scripts/firebaseUserTypes";
import SquareAvatar from "../../Misc/SquareAvatar";
import { PageProps } from "../../Pages";

const ViewEditUserPhoto: React.FunctionComponent<PageProps> = ({
  currentUser,
  currentUserProfile,
  setNotification,
  handleLoadUserData,
  setLoadingMessage,
  classes,
}) => {
  const [newProfilePicture, setNewProfilePicture] = React.useState<any>(null);
  const [editing, setEditing] = React.useState(false);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const cancelEditingImage = () => {
    cancelEditing();
    setNewProfilePicture(null);
  };

  const saveImage = () => {
    if (currentUser && currentUserProfile) {
      if (newProfilePicture) {
        setLoadingMessage("Updating Profile Picture...");
        // Start the unload
        const newProfilePictureUploadTask = profilePicturesRef
          .child(currentUserProfile.userId)
          .put(newProfilePicture);

        // Listen for state changes, errors, and completion of the upload.
        newProfilePictureUploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          (snapshot: {
            bytesTransferred: number;
            totalBytes: number;
            state: any;
          }) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                setNotification({
                  type: "info",
                  message: `Upload is paused and ${progress}% done`,
                  open: true,
                });
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                setNotification({
                  type: "info",
                  message: `Upload is running and ${progress}% done`,
                  open: true,
                });
                break;
            }
          },
          (error: { message: any }) => {
            setNotification({
              type: "error",
              message: error.message,
              open: true,
            });
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            newProfilePictureUploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                saveImageHelper(currentUser, currentUserProfile, downloadURL);
              });
          }
        );
      } else {
        saveImageHelper(currentUser, currentUserProfile, "");
      }
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to update profile picture. Try signing out and signing back in.",
        open: true,
      });
    }
  };

  const saveImageHelper = (
    user: firebase.User,
    userProfile: UserProfile,
    newPhotoUrl: string
  ) => {
    user
      .updateProfile({ photoURL: newPhotoUrl })
      .then(() => {
        updateUserProfileDatabase(userProfile.userId, {
          photoURL: newPhotoUrl,
        })
          .then((value) => {
            if (value) {
              setNotification({
                type: "success",
                message: "Profile Picture Updated Successfully!",
                open: true,
              });
              handleLoadUserData(userProfile.userId);
              cancelEditingImage();
              setLoadingMessage("");
            } else {
              setNotification({
                type: "warning",
                message:
                  "Something may have gone wrong while updating your profile picture. It should fix itself, but if your new profile picture is not visiable after a few minutes, please try updating it again.",
                open: true,
              });
              cancelEditingImage();
              setLoadingMessage("");
            }
          })
          .catch((err) => {
            console.log(err);
            setNotification({
              type: "warning",
              message:
                "Something may have gone wrong while updating your profile picture. It should fix itself, but if your new profile picture is not visiable after a few minutes, please try updating it again.",
              open: true,
            });
            cancelEditingImage();
            setLoadingMessage("");
          });
      })
      .catch((err) => {
        console.log(err);
        setNotification({
          type: "error",
          message: `Unable to profile picture. ${
            err.message ? err.message : "Please try again later."
          }`,
          open: true,
        });
        cancelEditingImage();
        setLoadingMessage("");
      });
  };

  const handleImageChange = (file: any) => {
    setNewProfilePicture(file);
  };

  return (
    <Fragment>
      <SquareAvatar
        alt={
          currentUserProfile?.displayName ? currentUserProfile.displayName : ""
        }
        src={currentUserProfile?.photoURL ? currentUserProfile.photoURL : ""}
        centerInContainer={true}
        maxHeightPercentageOfScreen={50}
        maxWidthPercentageOfParent={100}
        maxWidthPercentageOfScreen={50}
      />
      <Fab
        className={classes.profileEditImageButton}
        color="primary"
        size="small"
        onClick={() => {
          startEditing();
        }}
        aria-label="edit-image"
        id="profileTourStep11"
      >
        <EditIcon />
      </Fab>

      <Dialog
        open={editing}
        onClose={() => {
          cancelEditingImage();
        }}
        aria-labelledby="image-upload-title"
      >
        <DialogTitle id="image-upload-title">
          Upload a New Profile Picture
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Upload a new Profile Picture using the button below. Please make
            sure that your image file is less than 2 MB. For best results, a
            square image where your face is in or near the center is
            recommended.
          </DialogContentText>
          <DropzoneArea
            acceptedFiles={["image/*"]}
            filesLimit={1}
            maxFileSize={2000000}
            dropzoneText="Either drag and drop an image file here or click here to upload an image from your device."
            showAlerts={false}
            onDrop={(files) => {
              handleImageChange(files[0]);
              setNotification({
                type: "success",
                message: `File ${files[0].name} successfully added.`,
                open: true,
              });
            }}
            onDropRejected={(files, evt) => {
              setNotification({
                type: "error",
                message: `File ${files[0].name} was rejected. The file may not be supported or may be too big.`,
                open: true,
              });
            }}
            onDelete={(files) => {
              handleImageChange(null);
              setNotification({
                type: "info",
                message: `File ${files.name} removed.`,
                open: true,
              });
            }}
          ></DropzoneArea>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={2}
            alignItems="center"
            className={classes.profileViewEditGrid}
          >
            <Grid item xs={6} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  saveImage();
                }}
                aria-label="save-image"
              >
                <DoneIcon />
              </Fab>
            </Grid>
            <Grid item xs={6} className={classes.centerText}>
              <Fab
                color="primary"
                size="small"
                onClick={() => {
                  cancelEditingImage();
                }}
                aria-label="cancel-edit-image"
              >
                <ClearIcon />
              </Fab>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ViewEditUserPhoto;
