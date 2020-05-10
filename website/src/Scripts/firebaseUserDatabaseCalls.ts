import { firebaseApp } from "./firebaseConfig";
import {
  UserProfile,
  UserProfileUpdateObject,
  UserPublicProfile,
} from "./firebaseUserTypes";
import { logErrReturnFalse, logErrReturnNull } from "./helpers";

/**
 * createNewUserDatabaseObjects
 * @description Creates the datebase objects for a new user after account creation.
 * @param userData The data to save to the database.
 * @returns true if there were no errors creating the database object; false otherwise.
 */
export const createNewUserDatabaseObjects = ({
  userId,
  displayName,
  email,
  photoURL,
}: UserProfile): Promise<boolean> => {
  return firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .set({ userId, displayName, email, photoURL })
    .then(() => true)
    .catch(logErrReturnFalse);
};

export const getUserProfileDatabase = (
  userId: string
): Promise<UserProfile | null> => {
  return firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then((profile) => {
      const data = profile.data();
      return data ? (data as UserProfile) : null;
    })
    .catch(logErrReturnNull);
};

export const getCreateUserProfileDatabase = (
  userId: string,
  displayName?: string,
  email?: string,
  photoURL?: string
): Promise<UserProfile | null> => {
  return getUserProfileDatabase(userId)
    .then((profile) => {
      if (profile) {
        return profile;
      }
      return createNewUserDatabaseObjects({
        userId,
        displayName: displayName ? displayName : "",
        email: email ? email : "",
        photoURL: photoURL ? photoURL : "",
      })
        .then((success) => {
          if (success) {
            return getUserProfileDatabase(userId)
              .then((newProfile) => {
                if (newProfile) {
                  return newProfile;
                }
                return null;
              })
              .catch(logErrReturnNull);
          } else {
            return null;
          }
        })
        .catch(logErrReturnNull);
    })
    .catch(logErrReturnNull);
};

export const updateUserProfileDatabase = (
  userId: string,
  updateObject: UserProfileUpdateObject
): Promise<boolean> => {
  return firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .update(updateObject)
    .then(() => true)
    .catch(logErrReturnFalse);
};
