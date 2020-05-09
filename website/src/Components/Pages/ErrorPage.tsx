import { Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";

const ErrorPage: React.FunctionComponent<PageProps> = ({ classes }) => {
  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Error!</Typography>
      </Container>
      <Typography variant="h4">
        Unable to find the page you are looking for.
      </Typography>
      <Typography variant="body1">
        Unless, of course, you are looking for an error page. In which case,
        great job! You found it!{" "}
      </Typography>
    </Fragment>
  );
};

export default ErrorPage;
