export declare interface UserPublicProfile {
  userId: string;
  displayName: string;
  photoURL: string;
}

export declare interface UserProfile extends UserPublicProfile {
  email: string;
}

export declare type UserProfileUpdateObject = {
  displayName?: string;
  email?: string;
  photoURL?: string;
};
