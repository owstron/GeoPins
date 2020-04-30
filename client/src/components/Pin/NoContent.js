import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <ExploreIcon className={classes.icon} />
    <Typography
      noWrap
      variant='h6'
      component='h2'
      gutterBottom
      color='textPrimary'
      align='center'
    >
      Click on the map to create a pin
    </Typography>
  </div>
);

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
