import React from 'react';

import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { ReactComponent as LogoDb } from '../../assets/logos/logo_hidro_db_wbg.svg';

export function AppLoading(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <Box>
        <LogoDb style={{ height: '100px' }} />
      </Box>
      <Box width="100%" mr={1}>
        <LinearProgress variant="indeterminate" />
      </Box>
      <Box width="100%" mr={1}>
        Carregando aplicação...
      </Box>
    </Box>
  );
}

export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center" width="100%">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      {props.variant === 'determinate' ? (
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
}

export function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      {props.variant === 'determinate' ? (
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
}
