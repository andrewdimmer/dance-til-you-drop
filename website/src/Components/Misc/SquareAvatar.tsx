import { Avatar, createMuiTheme } from "@material-ui/core";
import {
  blue,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  pink,
  purple,
  red,
  teal
} from "@material-ui/core/colors";
import React, { Fragment } from "react";

declare interface SquareAvatarProps {
  maxWidthPercentageOfParent: number;
  maxWidthPercentageOfScreen: number;
  maxHeightPercentageOfScreen: number;
  alt: string;
  src: string;
  centerInContainer: boolean;
}

const SquareAvatar: React.FunctionComponent<SquareAvatarProps> = ({
  maxWidthPercentageOfParent,
  maxWidthPercentageOfScreen,
  maxHeightPercentageOfScreen,
  alt,
  src,
  centerInContainer
}) => {
  const parentWidth = React.useRef<HTMLDivElement>(null);
  const screenWidth = React.useRef<HTMLDivElement>(null);
  const screenHeight = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<number>(0);

  const computeWidthAndHeight = () => {
    if (parentWidth.current && screenWidth.current && screenHeight.current) {
      const newSize = Math.min(
        parentWidth.current.clientWidth,
        screenWidth.current.clientWidth,
        screenHeight.current.clientHeight
      );
      if (size !== newSize) {
        setSize(newSize);
      }
    }
  };

  const colors = [
    red[500],
    pink[500],
    purple[500],
    deepPurple[500],
    indigo[500],
    blue[500],
    teal[500],
    deepOrange[500],
    brown[500],
    green[600],
    lightGreen[900],
    cyan[700],
    lightBlue[900]
  ];

  const dummyTheme = createMuiTheme();

  const getColors = (
    character: string
  ): {
    text: string;
    background: string;
  } => {
    if (character.length === 0) {
      return {
        text: dummyTheme.palette.getContrastText(grey[600]),
        background: grey[400]
      };
    }
    const color = colors[character.charCodeAt(0) % colors.length];
    return {
      text: dummyTheme.palette.getContrastText(color),
      background: color
    };
  };

  const getStyle = (
    size: number,
    color: {
      text: string;
      background: string;
    }
  ): React.CSSProperties => {
    if (centerInContainer) {
      return {
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
        color: color.text,
        backgroundColor: color.background,
        margin: "auto"
      };
    } else {
      return {
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
        color: color.text,
        backgroundColor: color.background
      };
    }
  };

  const initializeSize = () => {
    computeWidthAndHeight();
    window.addEventListener("resize", () => {
      setTimeout(computeWidthAndHeight, 1);
    });
  };

  return (
    <Fragment>
      <div
        ref={parentWidth}
        style={{
          width: `${maxWidthPercentageOfParent}%`,
          height: 0
        }}
      />
      <div
        ref={screenWidth}
        style={{
          width: `${maxWidthPercentageOfScreen}vw`,
          height: 0,
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
      <div
        ref={screenHeight}
        style={{
          width: 0,
          height: `${maxHeightPercentageOfScreen}vh`,
          position: "absolute",
          top: 0,
          left: 0
        }}
      />
      <Avatar alt={alt} src={src} style={getStyle(size, getColors(alt))}>
        {alt.length > 0 ? alt.toUpperCase().charAt(0) : undefined}
      </Avatar>
      {setTimeout(initializeSize, 1) && <Fragment />}
    </Fragment>
  );
};

export default SquareAvatar;
