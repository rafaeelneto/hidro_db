import React from 'react';
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

import styles from './fullScreenDialog.module.scss';

const Transition = React.forwardRef(
  // eslint-disable-next-line react/require-default-props
  (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

export default function FullScreenDialog({
  open,
  onResponse,
  title,
  btnText,
  alwaysFull = false,
  ...otherProps
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm')) || alwaysFull;

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => onResponse(false)}
        TransitionComponent={Transition}
      >
        <AppBar className={styles.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onResponse(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={styles.title}>
              {title}
            </Typography>
            {btnText ? (
              <Button color="inherit" onClick={() => onResponse(true)}>
                {btnText}
              </Button>
            ) : (
              ''
            )}
          </Toolbar>
        </AppBar>
        <div className={styles.contentContainer}>{otherProps.children}</div>
      </Dialog>
    </div>
  );
}
