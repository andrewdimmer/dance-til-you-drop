import { Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";

const HighScorePage: React.FunctionComponent<PageProps> = ({ classes }) => {
  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">High Scores</Typography>
      </Container>
      <Typography variant="body1">
        Unfortunalty, this page is not quite ready for use. The scoring engine
        is still under development to determine how to accomodate the poses that
        are more human-ish than actually human doable.
      </Typography>
      <Typography variant="body1">
        The server itself is ready to go, just hang in there until we can score
        all the poses that are generated (then we're good to go!).
      </Typography>
    </Fragment>
  );
};

export default HighScorePage;
