import React from 'react';
import { CircularProgress, useTheme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const LoadingComponent = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};

export default LoadingComponent;
