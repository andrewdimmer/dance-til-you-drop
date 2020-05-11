import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import ScoreIcon from "@material-ui/icons/Score";
import PlayIcon from "@material-ui/icons/SportsEsports";
import { UserProfile } from "../../Scripts/firebaseUserTypes";
import { NotificationMessage } from "../Misc/Notifications";
import ErrorPage from "./ErrorPage";
import HighScorePage from "./HighScorePage";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import PlayPage from "./PlayPage";
import ProfilePage from "./ProfilePage";

export declare interface PageProps {
  setPageKey: (pageKey: string) => void;
  setLoadingMessage: (loadingMessage: string) => void;
  setNotification: (notification: NotificationMessage) => void;
  handleLoadUserData: (
    userId: string,
    displayName?: string,
    email?: string,
    photoUrl?: string
  ) => void;
  currentUser: firebase.User | null;
  currentUserProfile: UserProfile | null;
  classes: any;
}

export declare interface PageListForMenuItem {
  key: string;
  menuLabel: string;
  menuIcon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  displaySignedIn: boolean;
  displaySignedOut: boolean;
}

declare interface PageListItem extends PageListForMenuItem {
  title: string;
  component: React.FunctionComponent<PageProps>;
}

const pageList: PageListItem[] = [
  {
    key: "home",
    title: "",
    menuLabel: "Home",
    menuIcon: HomeIcon,
    displaySignedIn: true,
    displaySignedOut: true,
    component: HomePage,
  },
  {
    key: "play",
    title: "Play",
    menuLabel: "Play",
    menuIcon: PlayIcon,
    displaySignedIn: true,
    displaySignedOut: true,
    component: PlayPage,
  },
  {
    key: "highscores",
    title: "High Scores",
    menuLabel: "High Scores",
    menuIcon: ScoreIcon,
    displaySignedIn: true,
    displaySignedOut: true,
    component: HighScorePage,
  },
  {
    key: "login",
    title: "",
    menuLabel: "Join or Login",
    menuIcon: ExitToAppIcon,
    displaySignedIn: false,
    displaySignedOut: true,
    component: LoginPage,
  },
  {
    key: "profile",
    title: "Profile",
    menuLabel: "Profile",
    menuIcon: AccountCircleIcon,
    displaySignedIn: true,
    displaySignedOut: false,
    component: ProfilePage,
  },
  {
    key: "logout",
    title: "",
    menuLabel: "Logout",
    menuIcon: ExitToAppIcon,
    displaySignedIn: true,
    displaySignedOut: false,
    component: LogoutPage,
  },
];

const pageObject = pageList.reduce((pageObject, pageListItem) => {
  pageObject[pageListItem.key] = pageListItem;
  return pageObject;
}, {} as { [key: string]: PageListItem });

export const getPageComponent = (
  key: string
): React.FunctionComponent<PageProps> => {
  if (pageObject[key]) {
    return pageObject[key].component;
  }
  return ErrorPage;
};

export const getPageTitle = (key: string): string => {
  if (pageObject[key]) {
    return pageObject[key].title;
  }
  return "";
};

export const pageListForMenu: PageListForMenuItem[] = pageList.map(
  ({ key, menuLabel, menuIcon, displaySignedIn, displaySignedOut }) => {
    return { key, menuLabel, menuIcon, displaySignedIn, displaySignedOut };
  }
);
