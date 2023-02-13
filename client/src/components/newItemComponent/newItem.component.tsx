import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles, withStyles, Snackbar } from '@material-ui/core/';
import { useHistory } from 'react-router-dom';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import Button from '@material-ui/core/Button';

import clsx from 'clsx';

import LocationOnIcon from '@material-ui/icons/LocationOn';
import ListIcon from '@material-ui/icons/List';

import LocationPicker from '../maps/locationPicker.component';
import DetailsComponent from '../detailsItemComponent/detailsItem.component';
import AlertDialog from '../dialogs/alertDialog.component';
import Alert from '../alert/alert.component';

// =====================================
// MODEL IMPORTATIONS
// =====================================
import tablesBundler, { TablesBundler } from '../../models/tablesBundler';
import { gisFeature } from '../../models/Interfaces';

import { useHistoryState } from '../../utils/dataState.manager';
import { useMutationItem } from '../../graphql/fetchMutation';

import styles from './newItem.module.scss';

const NEW_FEATURE_ID = 'new';

const useStyles = makeStyles((theme: Theme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    stepper: {
      width: 600,
    },
    contentContainer: {
      width: '900px',
      height: '700px',
    },
    confirmBtn: {
      color: 'white',
      marginRight: theme.spacing(1),
    },
    cancelBtn: {
      marginRight: theme.spacing(1),
      border: `1px solid ${theme.palette.error.main}`,
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: 'rgb(229,115,115, 0.1)',
      },
      '&:disabled': {
        backgroundColor: theme.palette.error.light,
      },
    },
  }),
);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage: 'linear-gradient( 136deg, #ffcf60 0%, #FF9E2E 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage: 'linear-gradient( 136deg, #ffcf60 0%, #FF9E2E 100%)',
  },
});

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg,#ffcf60 0%, #FF9E2E 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg,#ffcf60 0%, #FF9E2E 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

function getSteps() {
  return ['Localização', 'Informações'];
}

function ColorlibStepIcon(isGis: boolean) {
  const classes = useColorlibStepIconStyles();
  const icons: React.ReactElement[] = [<LocationOnIcon />, <ListIcon />];
  if (!isGis) icons.shift();
  return (props: StepIconProps) => {
    const { active, completed, icon } = props;
    const iconIndex = Number(icon) - 1;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[iconIndex]}
      </div>
    );
  };
}

type NewItemProps = {
  tableName: string;
};

export default function NewItemComponent({ tableName }: NewItemProps) {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;

  const classes = useStyles();

  const history = useHistory();

  const { setHistoryOriginal, getHistoryLastItem, resetHistory } = useHistoryState();

  const { onInsert } = useMutationItem(tableName, table);

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [failure, setFailure] = useState(false);

  // SET MUTATION LISTENER TO GO BACK TO TABLE VIEW IF THE MUTATION IS SUCCESSED

  const onMutationListener = () => {
    history.goBack();
  };

  const { attach, detach } = useMutationItem(tableName, table);

  useEffect(() => {
    attach(onMutationListener);
    return () => detach(onMutationListener);
  }, []);

  const steps = getSteps();

  let isGis = true;
  if (!table['getGIS']) {
    steps.shift();
    isGis = false;
  }

  const fieldsArray = table.getFieldsArray();

  const handleNext = () => {
    if (activeStep === 0 && !position && isGis) {
      setFailure(true);
      return;
    }
    if (activeStep === steps.length - 1) {
      onInsert(position);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (!getHistoryLastItem(tableName, NEW_FEATURE_ID)) {
    const originalState = {};

    fieldsArray.map(
      (field) => (originalState[field.columnName] = field.getValue ? field.getValue({}) : ''),
    );

    setHistoryOriginal(tableName, NEW_FEATURE_ID, originalState);
  }

  const onChangePosition = ({ lat, lng }: { lat: number; lng: number }) => {
    setPosition({ lat, lng });
  };

  const onCancelResponse = (response) => {
    if (response) {
      resetHistory(tableName, 'new', true);
      history.goBack();
    }

    setCancelDialogOpen(false);
  };

  const getStepContent = (step: number) => {
    if (!isGis) return <DetailsComponent tableName={tableName} featureId={NEW_FEATURE_ID} />;
    switch (step) {
      case 0:
        return <LocationPicker position={position} onChangePosition={onChangePosition} />;
      case 1:
        return <DetailsComponent tableName={tableName} featureId={NEW_FEATURE_ID} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className={styles.root}>
      <Stepper
        className={classes.stepper}
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon(isGis)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div>
          <div className={styles.contentContainer}>{getStepContent(activeStep)}</div>
          <div>
            <div>
              <Button
                onClick={() => {
                  setCancelDialogOpen(true);
                }}
                className={classes.cancelBtn}
              >
                Cancelar
              </Button>
              {!(activeStep === 0) ? (
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Voltar
                </Button>
              ) : (
                ''
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.confirmBtn}
              >
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog
        open={cancelDialogOpen}
        title="Cancelar adição deste item?"
        msg="Você tem certeza que deseja cancelar? Essa operação não pode ser desfeita e todos os 
        dados que você colocou até agora serão excluídos"
        onResponse={onCancelResponse}
      />
      <Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}>
        <Alert onClose={() => setFailure(false)} severity="error">
          Por favor. Coloque a localização do ponto
        </Alert>
      </Snackbar>
    </div>
  );
}
