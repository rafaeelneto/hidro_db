/* eslint-disable arrow-body-style */
import React, { useState, useRef } from 'react';
import {
  Button,
  IconButton,
  Collapse,
  TextField,
  ListItemSecondaryAction,
  InputAdornment,
  Snackbar,
  Input,
  InputBase,
} from '@material-ui/core';

import { gql, useQuery } from '@apollo/client';

import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { format } from 'date-fns';

import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DragIndicatorIcon from '@material-ui/icons/DragHandle';

import Checkbox from '@material-ui/core/Checkbox';

import { Trash, PlusCircle, Upload, Download, XCircle, FileText } from 'react-feather';

import download from 'downloadjs';

import PerfilDrawer from '../perfilDrawer/perfilDrawer.component';
import { useHistoryState } from '../../utils/dataState.manager';

import {
  BoreHoleLayer,
  HoleFillLayer,
  WellScreenLayer,
  GeologicLayer,
  WellCaseLayer,
  SurfaceCaseLayer,
} from './inputComponents';

import { Field } from '../../models/Interfaces';

import styles from './perfilEditor.module.scss';

import { onChangeValuesType, onChangeListType, LayerProps } from '../../types/perfilEditor.types';

import {
  GEOLOGIC_COMPONENT_TYPE,
  BORE_HOLE_COMPONENT_TYPE,
  CEMENT_PAD_COMPONENT_TYPE,
  HOLE_FILL_COMPONENT_TYPE,
  PROFILE_TYPE,
  SURFACE_CASE_COMPONENT_TYPE,
  WELL_CASE_COMPONENT_TYPE,
  WELL_SCREEN_COMPONENT_TYPE,
} from '../../types/perfil.types';

type PerfilEditDialogProps = {
  field: Field;
  tableName: string;
  featureId: string | number;
  // eslint-disable-next-line react/require-default-props
  nomePoco?: string;
};

const PROFILE_DEFAULT: PROFILE_TYPE = {
  geologic: [],
  constructive: {
    bole_hole: [],
    well_screen: [],
    surface_case: [],
    well_case: [],
    hole_fill: [],
    cement_pad: {
      type: '',
      width: 0,
      thickness: 0,
      length: 0,
    },
  },
};

// const NULL_VALUE = { value: PROFILE_DEFAULT, label: '' };

const GEOLOGIC_COMPONENT_DEFAULT: GEOLOGIC_COMPONENT_TYPE = {
  from: 0,
  to: 10,
  description: '',
  color: '#ff0000',
  fgdc_texture: '',
  geologic_unit: '',
};

const BORE_HOLE_COMPONENT_DEFAULT: BORE_HOLE_COMPONENT_TYPE = {
  from: 0,
  to: 10,
  diam_pol: 10,
};
const WELL_CASE_COMPONENT_DEFAULT: WELL_CASE_COMPONENT_TYPE = {
  from: 0,
  to: 10,
  type: '',
  diam_pol: 10,
};

const WELL_SCREEN_COMPONENT_DEFAULT: WELL_SCREEN_COMPONENT_TYPE = {
  from: 0,
  to: 10,
  type: '',
  diam_pol: 10,
  screen_slot_mm: 0.75,
};
const HOLE_FILL_COMPONENT_DEFAULT: HOLE_FILL_COMPONENT_TYPE = {
  from: 0,
  to: 10,
  type: 'seal',
  diam_pol: 10,
  description: '',
};
const SURFACE_CASE_COMPONENT_DEFAULT: SURFACE_CASE_COMPONENT_TYPE = {
  from: 0,
  to: 20,
  diam_pol: 10,
};

const SortableList = ({
  layers,
  defaultComponent,
  component,
  onChangeList,
  onChangeValues,
}: {
  layers: any[];
  component: any;
  defaultComponent: any;
  onChangeList: onChangeListType;
  onChangeValues: onChangeValuesType;
}) => {
  const onDrop = ({ removedIndex, addedIndex }) => {
    onChangeList(arrayMoveImmutable(layers, removedIndex, addedIndex));
  };
  const onDelete = (index) => {
    const newLayers = [...layers];
    newLayers.splice(index, 1);
    onChangeList(newLayers);
  };
  const onAdd = () => {
    const newLayers = [...layers];
    newLayers.push(defaultComponent);
    onChangeList(newLayers);
  };

  const LayerComponent: React.FC<LayerProps> = component;

  return (
    <List className={styles.sortableList}>
      <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
        {layers.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Draggable key={index}>
            <ListItem>
              <ListItemIcon
                style={{
                  height: '24px',
                  minWidth: 'auto',
                  marginRight: '5px',
                }}
                className="drag-handle"
              >
                <DragIndicatorIcon />
              </ListItemIcon>
              <ListItemIcon
                onClick={() => onDelete(index)}
                style={{
                  height: '24px',
                  minWidth: 'auto',
                  marginRight: '5px',
                }}
                className="drag-handle"
              >
                <XCircle />
              </ListItemIcon>

              <LayerComponent component={item} index={index} onChangeValues={onChangeValues} />
            </ListItem>
          </Draggable>
        ))}
        <ListItem className={styles.btnAdd} dense button onClick={() => onAdd()}>
          <ListItemIcon style={{ height: '24px', minWidth: 'auto', marginRight: '5px' }}>
            <PlusCircle />
          </ListItemIcon>
          Adicionar
        </ListItem>
      </Container>
    </List>
  );
};

function TabPanel(props) {
  const { children, value, index } = props;

  if (value !== index) return <></>;

  return (
    <div style={{ height: '90%', overflowY: 'auto' }} hidden={value !== index}>
      {value === index ? <>{children}</> : ''}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PerfilEditor = ({ field, tableName, featureId, nomePoco = '' }: PerfilEditDialogProps) => {
  const inputFile = useRef(null);

  const [profileState, setProfileState] = useState(PROFILE_DEFAULT);
  const [changesCounter, setChangesCounter] = useState(0);

  const [openImportErrorS, setOpenImportErrorS] = useState(false);

  const [cementPadChecked, setcementPadChecked] = useState(false);

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { addHistoryItem, getHistoryLastItem } = useHistoryState();

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  // GET THE LIST OF FILES
  let stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value: perfil } = stateItem[field.columnName] || PROFILE_DEFAULT;

  // GET THE LIST OF FILES

  const saveFileList = () => {
    stateItem = { ...stateItem };
    stateItem[field.columnName] = { value: profileState, label: '-' };
    addHistoryItem(tableName, featureId, stateItem);
  };

  // handle on change of properties
  const handleSave = () => {
    saveFileList();
  };

  const reorderComponentsDepth = (newGeologicLayers) => {
    const newLayers: any[] = [];
    let currentDepth: number = 0;
    for (let index = 0; index < newGeologicLayers.length; index++) {
      const newLayer = newGeologicLayers[index];
      const layerThickness = newLayer.to - newLayer.from;
      const newFrom = index === 0 ? 0 : currentDepth;
      const newTo = newFrom + layerThickness;
      currentDepth += layerThickness;
      newLayers.push({ ...newLayer, from: newFrom, to: newTo });
    }
    return newLayers;
  };

  const onChangePerfilState = (newPerfilState) => {
    setProfileState(newPerfilState);
    setChangesCounter(changesCounter + 1);
    if (changesCounter > 30) {
      setChangesCounter(0);
      handleSave();
    }
  };

  const reorderHandlers = {
    geologic: (newGeologicLayers) => {
      const newPerfilState = {
        ...profileState,
        geologic: reorderComponentsDepth(newGeologicLayers),
      };
      onChangePerfilState(newPerfilState);
    },
    hole_fill: (newRevectComp) => {
      const newEAList = reorderComponentsDepth(newRevectComp);
      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, hole_fill: newEAList },
      };
      onChangePerfilState(newPerfilState);
    },
    surface_case: (newRevectComp) => {
      const newTBList = newRevectComp;
      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, surface_case: newTBList },
      };
      onChangePerfilState(newPerfilState);
    },
    bole_hole: (newRevectComp) => {
      const newBoreHoleList = reorderComponentsDepth(newRevectComp);
      const newPerfilState = {
        ...profileState,
        constructive: {
          ...profileState.constructive,
          bole_hole: newBoreHoleList,
        },
      };
      onChangePerfilState(newPerfilState);
    },
    well_case: (newRevectComp) => {
      // const newRevestList = reorderComponentsDepth(newRevectComp);
      const newPerfilState = {
        ...profileState,
        constructive: {
          ...profileState.constructive,
          well_case: newRevectComp,
        },
      };
      onChangePerfilState(newPerfilState);
    },
    well_screen: (newComponents) => {
      // const newRevestList = reorderComponentsDepth(newRevectComp);
      const newPerfilState = {
        ...profileState,
        constructive: {
          ...profileState.constructive,
          well_screen: newComponents,
        },
      };
      onChangePerfilState(newPerfilState);
    },
  };

  const onChangeHandlers = {
    geologic: (newLayer, index) => {
      const newLayers = [...profileState.geologic];
      newLayers[index] = newLayer;
      const newPerfilState = {
        ...profileState,
        geologic: reorderComponentsDepth(newLayers),
      };
      onChangePerfilState(newPerfilState);
    },
    hole_fill: (newEA, index) => {
      const newLayers = [...profileState.constructive.hole_fill];
      newLayers[index] = newEA;
      const newEAList = reorderComponentsDepth(newLayers);

      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, hole_fill: newEAList },
      };
      onChangePerfilState(newPerfilState);
    },
    surface_case: (newTB, index) => {
      const newLayers = [...profileState.constructive.surface_case];
      newLayers[index] = newTB;
      const newTBList = reorderComponentsDepth(newLayers);

      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, surface_case: newTBList },
      };
      onChangePerfilState(newPerfilState);
    },
    bole_hole: (newbole_holes, index) => {
      const newLayers = [...profileState.constructive.bole_hole];
      newLayers[index] = newbole_holes;
      const newBoleHoleList = reorderComponentsDepth(newLayers);

      const newPerfilState = {
        ...profileState,
        constructive: {
          ...profileState.constructive,
          bole_hole: newBoleHoleList,
        },
      };
      onChangePerfilState(newPerfilState);
    },
    well_case: (newRevest, index) => {
      const newLayers = [...profileState.constructive.well_case];
      newLayers[index] = newRevest;
      // const newRevestList = reorderComponentsDepth(newLayers);

      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, well_case: newLayers },
      };
      onChangePerfilState(newPerfilState);
    },
    well_screen: (newComps, index) => {
      const newLayers = [...profileState.constructive.well_screen];
      newLayers[index] = newComps;
      // const newRevestList = reorderComponentsDepth(newLayers);

      const newPerfilState = {
        ...profileState,
        constructive: { ...profileState.constructive, well_screen: newLayers },
      };
      onChangePerfilState(newPerfilState);
    },
  };

  const handleCementPadChange = (property, value) => {
    const newcementPad = { ...profileState.constructive.cement_pad };
    newcementPad[property] = value;

    const newPerfilState = {
      ...profileState,
      constructive: { ...profileState.constructive, cement_pad: newcementPad },
    };
    onChangePerfilState(newPerfilState);
  };

  const handleClickFile = (event) => {
    // @ts-ignore
    inputFile.current.click();
  };

  const transformProfileFormat = (perfil) => {
    let perfilImported = { ...perfil };
    let noPerfil = true;
    if (perfilImported.geologic && perfilImported.constructive) {
      noPerfil =
        perfilImported.geologic.length === 0 &&
        perfilImported.constructive.bole_hole.length === 0 &&
        perfilImported.constructive.hole_fill.length === 0 &&
        perfilImported.constructive.well_screen.length === 0;
    }

    if (noPerfil) {
      const perfilConverted = PROFILE_DEFAULT;
      if (perfilImported.geologico || perfilImported.construtivo) {
        if (perfilImported.geologico.length > 0) {
          perfilConverted.geologic = perfilImported.geologico.map((camada) => {
            return {
              from: parseFloat(camada.de),
              to: parseFloat(camada.ate),
              fgdc_texture: camada.fgdc_texture || '',
              color: camada.color || '',
              description: camada.descricao || '',
              geologic_unit: camada.unidade_geologica || '',
            };
          });
        }
        if (perfilImported.construtivo.furo.length > 0) {
          perfilConverted.constructive.bole_hole = perfilImported.construtivo.furo.map((camada) => {
            return {
              from: parseFloat(camada.de),
              to: parseFloat(camada.ate),
              diam_pol: parseFloat(camada.diam_pol) || 0,
            };
          });
        }
        if (perfilImported.construtivo.espaco_anelar.length > 0) {
          perfilConverted.constructive.hole_fill = perfilImported.construtivo.espaco_anelar.map(
            (camada) => {
              let tipo = 'gravel_pack';
              if (camada.tipo === 'cimento') {
                tipo = 'seal';
              }
              return {
                from: parseFloat(camada.de),
                to: parseFloat(camada.ate),
                diam_pol: parseFloat(camada.diam_pol) || 0,
                description: camada.descricao || '',
                // eslint-disable-next-line eqeqeq
                type: tipo,
              };
            },
          );
        }
        if (perfilImported.construtivo.filtros.length > 0) {
          perfilConverted.constructive.well_screen = perfilImported.construtivo.filtros.map(
            (camada) => {
              return {
                from: parseFloat(camada.de),
                to: parseFloat(camada.ate),
                type: camada.tipo || '',
                diam_pol: parseFloat(camada.diam_pol) || 0,
                screen_slot_mm: parseFloat(camada.ranhura_mm) || 0,
              };
            },
          );
        }
        if (perfilImported.construtivo.revestimento.length > 0) {
          perfilConverted.constructive.well_case = perfilImported.construtivo.revestimento.map(
            (camada) => {
              return {
                from: parseFloat(camada.de),
                to: parseFloat(camada.ate),
                type: camada.tipo || '',
                diam_pol: parseFloat(camada.diam_pol) || 0,
              };
            },
          );
        }
        if (perfilImported.construtivo.tubo_boca.length > 0) {
          perfilConverted.constructive.surface_case = perfilImported.construtivo.tubo_boca.map(
            (camada) => {
              const depth = parseFloat(camada.altura) || parseFloat(camada.depth) || 0;
              return {
                from: camada.from || 0,
                to: camada.to || depth,
                diam_pol: parseFloat(camada.diam_pol) || 0,
              };
            },
          );
        }
        if (perfilImported.construtivo.laje.largura) {
          perfilConverted.constructive.cement_pad = {
            type: perfilImported.construtivo.laje.tipo,
            thickness: parseFloat(perfilImported.construtivo.laje.espessura),
            width: parseFloat(perfilImported.construtivo.laje.largura),
            length: parseFloat(perfilImported.construtivo.laje.comprimento),
          };
        }
        perfilImported = { ...perfilConverted };
      } else {
        setOpenImportErrorS(true);
        return;
      }
    }

    if (
      perfilImported.constructive &&
      perfilImported.constructive.cement_pad &&
      perfilImported.constructive.cement_pad.width
    ) {
      setcementPadChecked(true);
    }
    setProfileState(perfilImported);
  };

  const handleChangeInputFile = (event) => {
    const fileUploaded = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e) return;
      // @ts-ignore
      const perfilImported = JSON.parse(e.target.result);

      transformProfileFormat(perfilImported);
    };
    reader.readAsText(fileUploaded);
  };

  if (profileState === PROFILE_DEFAULT) {
    transformProfileFormat(perfil);
  }

  // let noPerfil = true;
  // if (profileState.geologic && profileState.constructive) {
  //   noPerfil =
  //     profileState.geologic.length === 0 &&
  //     profileState.constructive.bole_hole.length === 0 &&
  //     profileState.constructive.hole_fill.length === 0 &&
  //     profileState.constructive.well_case.length === 0 &&
  //     profileState.constructive.well_screen.length === 0;
  // }

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.headerContainer}>
          <div className={styles.btnContainer}>
            <Button
              className={styles.mainBtns}
              onClick={handleSave}
              color="primary"
              variant="contained"
            >
              Salvar
            </Button>
            <Snackbar
              className="errorSnackBar"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={openImportErrorS}
              autoHideDuration={6000}
              onClose={() => {
                setOpenImportErrorS(false);
              }}
              message="Erro ao importar o arquivo. Verifique seu arquivo e tente novamente"
              // eslint-disable-next-line no-useless-concat
              key={'top' + 'center'}
            />

            <Button
              className={styles.mainBtns}
              onClick={() => {
                const profileToSave = { ...profileState };

                const perfilJSON = JSON.stringify(profileToSave);

                const blob = new Blob([perfilJSON], {
                  type: 'application/json',
                });

                download(
                  blob,
                  `perfil_${nomePoco.replace(/ /g, '_').toLowerCase()}_${format(
                    new Date(),
                    'dd_MM_yyyy__hh_mm',
                  )}.json`,
                  'application/json',
                );
              }}
              startIcon={<Download />}
              color="primary"
            >
              Exportar Dados
            </Button>
            <>
              <Button
                className={styles.mainBtns}
                onClick={handleClickFile}
                startIcon={<Upload />}
                color="primary"
              >
                Importar Dados
              </Button>

              <input
                type="file"
                ref={inputFile}
                onChange={handleChangeInputFile}
                accept="application/json"
                style={{ display: 'none' }}
              />
            </>
          </div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.perfilContainer}`}>
            <PerfilDrawer perfil={profileState} />
          </div>
          <div className={styles.dataContainer}>
            <Box>
              <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Construtivo" {...a11yProps(0)} />
                <Tab label="Geológico" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <div className={styles.inputContainers}>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>
                    Laje de Proteção Sanitária
                    <Checkbox
                      checked={cementPadChecked}
                      onChange={(event) => {
                        const { checked } = event.target;

                        if (checked) {
                          const newPerfilState = {
                            ...profileState,
                            constructive: {
                              ...profileState.constructive,
                              cement_pad: {
                                width: 3,
                                thickness: 0.25,
                                length: 3,
                                type: 'Cimento',
                              },
                            },
                          };
                          setProfileState(newPerfilState);
                        } else {
                          const newPerfilState = {
                            ...profileState,
                            constructive: {
                              ...profileState.constructive,
                              cement_pad: {
                                type: '',
                                width: 0,
                                thickness: 0,
                                length: 0,
                              },
                            },
                          };
                          setProfileState(newPerfilState);
                        }

                        setcementPadChecked(checked);
                      }}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </span>

                  <Collapse in={cementPadChecked} unmountOnExit>
                    <div>
                      <div className={styles.layerRow}>
                        <TextField
                          size="small"
                          variant="standard"
                          className={styles.layerInput}
                          id="standard-multiline-flexible"
                          label="Largura"
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                          }}
                          value={
                            profileState &&
                            profileState.constructive &&
                            profileState.constructive.cement_pad &&
                            profileState.constructive.cement_pad.width
                              ? profileState.constructive.cement_pad.width
                              : ''
                          }
                          onChange={(event) => {
                            // eslint-disable-next-line implicit-arrow-linebreak
                            handleCementPadChange('width', event.target.value);
                          }}
                        />

                        <TextField
                          size="small"
                          variant="standard"
                          className={styles.layerInput}
                          id="standard-multiline-flexible"
                          label="Comprimento"
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                          }}
                          value={
                            profileState &&
                            profileState.constructive &&
                            profileState.constructive.cement_pad &&
                            profileState.constructive.cement_pad.length
                              ? profileState.constructive.cement_pad.length
                              : ''
                          }
                          onChange={(event) => {
                            // eslint-disable-next-line implicit-arrow-linebreak
                            handleCementPadChange('length', event.target.value);
                          }}
                        />
                        <TextField
                          size="small"
                          variant="standard"
                          className={styles.layerInput}
                          id="standard-multiline-flexible"
                          label="Espessura"
                          type="number"
                          InputProps={{
                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                          }}
                          value={
                            profileState &&
                            profileState.constructive &&
                            profileState.constructive.cement_pad &&
                            profileState.constructive.cement_pad.thickness
                              ? profileState.constructive.cement_pad.thickness
                              : ''
                          }
                          onChange={(event) => {
                            // eslint-disable-next-line implicit-arrow-linebreak
                            handleCementPadChange('thickness', event.target.value);
                          }}
                        />
                      </div>
                      <TextField
                        size="small"
                        variant="standard"
                        className={styles.layerInput}
                        id="standard-multiline-flexible"
                        label="Tipo"
                        value={
                          profileState &&
                          profileState.constructive &&
                          profileState.constructive.cement_pad &&
                          profileState.constructive.cement_pad.type
                            ? profileState.constructive.cement_pad.type
                            : ''
                        }
                        onChange={(event) => {
                          // eslint-disable-next-line implicit-arrow-linebreak
                          handleCementPadChange('type', event.target.value);
                        }}
                      />
                    </div>
                  </Collapse>
                </div>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>Furo:</span>
                  {profileState &&
                  profileState.constructive &&
                  profileState.constructive.bole_hole ? (
                    <SortableList
                      defaultComponent={BORE_HOLE_COMPONENT_DEFAULT}
                      layers={profileState.constructive.bole_hole}
                      component={BoreHoleLayer}
                      onChangeList={reorderHandlers.bole_hole}
                      onChangeValues={onChangeHandlers.bole_hole}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>Espaço Anelar:</span>
                  {profileState &&
                  profileState.constructive &&
                  profileState.constructive.hole_fill ? (
                    <SortableList
                      defaultComponent={HOLE_FILL_COMPONENT_DEFAULT}
                      layers={profileState.constructive.hole_fill}
                      component={HoleFillLayer}
                      onChangeList={reorderHandlers.hole_fill}
                      onChangeValues={onChangeHandlers.hole_fill}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>Tubo de Boca:</span>
                  {profileState &&
                  profileState.constructive &&
                  profileState.constructive.surface_case ? (
                    <SortableList
                      defaultComponent={SURFACE_CASE_COMPONENT_DEFAULT}
                      layers={profileState.constructive.surface_case}
                      component={SurfaceCaseLayer}
                      onChangeList={reorderHandlers.surface_case}
                      onChangeValues={onChangeHandlers.surface_case}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>Revestimento:</span>
                  {profileState &&
                  profileState.constructive &&
                  profileState.constructive.well_case ? (
                    <SortableList
                      defaultComponent={WELL_CASE_COMPONENT_DEFAULT}
                      layers={profileState.constructive.well_case}
                      component={WellCaseLayer}
                      onChangeList={reorderHandlers.well_case}
                      onChangeValues={onChangeHandlers.well_case}
                    />
                  ) : (
                    ''
                  )}
                </div>
                <div className={styles.componentContainer}>
                  <span className={styles.componentTitle}>Filtros:</span>
                  {profileState &&
                  profileState.constructive &&
                  profileState.constructive.well_screen ? (
                    <SortableList
                      defaultComponent={WELL_SCREEN_COMPONENT_DEFAULT}
                      layers={profileState.constructive.well_screen}
                      component={WellScreenLayer}
                      onChangeList={reorderHandlers.well_screen}
                      onChangeValues={onChangeHandlers.well_screen}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <div className={styles.inputContainers}>
                {profileState && profileState.geologic ? (
                  <SortableList
                    defaultComponent={GEOLOGIC_COMPONENT_DEFAULT}
                    layers={profileState.geologic}
                    component={GeologicLayer}
                    onChangeList={reorderHandlers.geologic}
                    onChangeValues={onChangeHandlers.geologic}
                  />
                ) : (
                  ''
                )}
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilEditor;
