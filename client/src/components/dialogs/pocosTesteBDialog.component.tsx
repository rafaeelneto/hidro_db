/* eslint-disable camelcase */
import React, { useState } from 'react';

import {
  Button,
  List,
  ListItem,
  Divider,
  ListItemText,
  Collapse,
  Paper,
  TextField,
  CircularProgress,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Snackbar,
} from '@material-ui/core';

import { DataGrid } from '@material-ui/data-grid';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { gql, useQuery, useMutation } from '@apollo/client';

import { PlusCircle, XCircle, Trash, RefreshCw, ChevronDown, ChevronUp } from 'react-feather';

import Alert from '../alert/alert.component';
import FullScreenDialog from './fullScreenDialog.component';
import FilesListAux from '../auxComponents/filesListAux.component';

import LoadingComponent from '../loadingComponents/loading.component';

import { linearRegression } from '../../utils/mathUtils';

import styles from './pocosTesteBDialog.module.scss';

type testeBType = {
  id?: string;
  last_modif?: string;
  usr_modif?: string;
  executor: string;
  bomba_model: string;
  bomba_pot: string;
  pos_bomba: string;
  data_inicio: string;
  data_final: string;
  tipo_teste: string;
  ne: string;
  vazao_estab_final: string;
  q1: string;
  r1: string;
  q2?: string | null;
  r2?: string | null;
  q3?: string | null;
  r3?: string | null;
  dados_brut_bomb?: any;
  dados_brut_recup?: any;
  obs?: string;
  // todo
  files?: any;
};

type TesteBEditProps = {
  teste: testeBType | any;
  onChangeTeste: (newTeste: testeBType) => void;
  featureId?: string | number;
  newTeste?: boolean;
  testeId?: string | number;
  isOnEdit?: boolean;
};

type valueType = {
  value: string;
  label: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const ResumoEscalonado = ({ teste, onChangeTeste, isOnEdit }: TesteBEditProps) => (
  <div className={styles.etapasWrapper}>
    <div className={styles.etapaContainer}>
      <span className={styles.title}>1° etapa</span>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Vazão 1° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.q1}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, q1: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Rebaixamento 1° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.r1}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, r1: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Rebaix. Especif. (s/Q):</span>
        {`${
          teste.r1 && teste.q1 ? (parseFloat(teste.r1) / parseFloat(teste.q1)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Capacidade. Especif. (Q/s):</span>
        {`${
          teste.r1 && teste.q1 ? (parseFloat(teste.q1) / parseFloat(teste.r1)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
    </div>
    <div className={styles.etapaContainer}>
      <span className={styles.title}>2° etapa</span>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Vazão 2° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.q2}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, q2: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Rebaixamento 2° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.r2}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, r2: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Rebaix. Especif. (s/Q):</span>
        {`${
          teste.r2 && teste.q2 ? (parseFloat(teste.r2) / parseFloat(teste.q2)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Capacidade. Especif. (Q/s):</span>
        {`${
          teste.r2 && teste.q2 ? (parseFloat(teste.q2) / parseFloat(teste.r2)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
    </div>
    <div className={styles.etapaContainer}>
      <span className={styles.title}>3° etapa</span>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Vazão 3° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.q3}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, q3: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Rebaixamento 3° Etapa</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.r3}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, r3: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Rebaix. Especif. (s/Q):</span>
        {`${
          teste.r3 && teste.q3 ? (parseFloat(teste.r3) / parseFloat(teste.q3)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Capacidade. Especif. (Q/s):</span>
        {`${
          teste.r3 && teste.q3 ? (parseFloat(teste.q3) / parseFloat(teste.r3)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
    </div>
  </div>
);

const ResumoContinuo = ({ teste, onChangeTeste, isOnEdit }: TesteBEditProps) => (
  <div className={styles.etapasWrapper}>
    <div className={styles.etapaContainer}>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Vazão</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.q1}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, q1: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.field}>
        <FormControl>
          <InputLabel htmlFor="component-simple">Rebaixamento</InputLabel>
          <Input
            // eslint-disable-next-line react/jsx-props-no-spreading
            id="standard-multiline-flexible"
            type="number"
            endAdornment={<InputAdornment position="end">m</InputAdornment>}
            style={{ width: '100%' }}
            disabled={!isOnEdit}
            value={teste.r1}
            onChange={(event) => {
              // eslint-disable-next-line implicit-arrow-linebreak
              onChangeTeste({ ...teste, r1: event.target.value });
            }}
          />
        </FormControl>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Rebaix. Especif. (s/Q):</span>
        {`${
          teste.r1 && teste.q1 ? (parseFloat(teste.r1) / parseFloat(teste.q1)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Capacidade. Especif. (Q/s):</span>
        {`${
          teste.r1 && teste.q1 ? (parseFloat(teste.q1) / parseFloat(teste.r1)).toFixed(4) : '-'
        } m/m³/h`}
      </div>
    </div>
  </div>
);

type dadosBrutosBombPontosType = {
  id: string | number;
  min: string | number;
  q: string | number;
  s: string | number;
};

type dadosBrutosBombUnitType = {
  hora: string;
  dados: dadosBrutosBombPontosType[];
};

type dadosBrutosBombType = {
  1: dadosBrutosBombUnitType;
  2?: dadosBrutosBombUnitType;
  3?: dadosBrutosBombUnitType;
};

const dadosBrutoDefault = {
  hora: new Date().toISOString(),
  dados: [
    { id: 1, min: 1, q: 0, s: 0 },
    { id: 2, min: 2, q: 0, s: 0 },
    { id: 5, min: 5, q: 0, s: 0 },
    { id: 10, min: 10, q: 0, s: 0 },
    { id: 30, min: 30, q: 0, s: 0 },
    { id: 60, min: 60, q: 0, s: 0 },
    { id: 120, min: 120, q: 0, s: 0 },
    { id: 180, min: 180, q: 0, s: 0 },
  ],
};

const dadosBrutosColumns = [
  {
    field: 'min',
    headerName: 'Min',
    editable: true,
    minWidth: 120,
  },
  {
    field: 'q',
    headerName: 'Q (m³/h)',
    editable: true,
    minWidth: 120,
  },
  {
    field: 's',
    headerName: 's (m)',
    editable: true,
    minWidth: 120,
  },
];

const BrutosEscalonado = ({ teste, onChangeTeste, featureId }: TesteBEditProps) => {
  const dadosBrutos: dadosBrutosBombType = teste.dados_brut_bomb['1']
    ? teste.dados_brut_bomb
    : {
        1: dadosBrutoDefault,
        2: dadosBrutoDefault,
        3: dadosBrutoDefault,
      };

  console.log(teste.dados_brut_bomb);
  console.log({ dadosBrutos });

  const onChangeDadoBruto = (newDadoBruto, id) => {
    const newDadosBrutos = { ...dadosBrutos };
    newDadosBrutos[id] = newDadoBruto;

    onChangeTeste({ ...teste, dados_brut_bomb: newDadosBrutos });
  };

  const onChangeCells = (params, event) => {
    console.log(event.target);
  };

  return (
    <div className={styles.etapasWrapper}>
      {Object.keys(dadosBrutos).map((dadoBrutoId) => {
        const dadoBruto = dadosBrutos[dadoBrutoId];
        return (
          <div className={styles.etapaContainer}>
            <div className={styles.field}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                <KeyboardTimePicker
                  style={{ width: '100%' }}
                  format="p"
                  mask="__:__"
                  ampm={false}
                  label="Hora Inicial"
                  value={dadoBruto.hora}
                  onChange={(date) => {
                    // eslint-disable-next-line implicit-arrow-linebreak
                    // @ts-ignore
                    if (date == 'Invalid Date' || date == 'Invalid time value' || date == null)
                      return;
                    const newDadoBruto = { ...dadoBruto, hora: new Date(date).toISOString() };
                    // eslint-disable-next-line implicit-arrow-linebreak
                    onChangeDadoBruto(newDadoBruto, dadoBrutoId);
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className={styles.pontosContainer}>
              <DataGrid
                disableColumnMenu
                hideFooterPagination
                columns={dadosBrutosColumns}
                rows={dadoBruto.dados}
                onEditCellPropsChange={onChangeCells}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const optionsTeste: valueType[] = [
  { value: '', label: 'não definido' },
  { value: 'continuo', label: 'Contínuo' },
  { value: 'escalonado', label: 'Escalonado' },
];

const TesteBombeamentoEdit = ({
  teste: thisTeste,
  onChangeTeste,
  featureId,
  newTeste,
  testeId,
  isOnEdit,
}: TesteBEditProps) => {
  const [openB, setOpenB] = React.useState(true);
  const [valueTabBomb, setValueTabBomb] = React.useState(0);

  // console.log(thisTeste);

  const handleChangeTabBomb = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValueTabBomb(newValue);
  };

  const handleBombClick = () => {
    setOpenB(!openB);
  };

  return (
    <div className={styles.editContainerRoot}>
      <div className={styles.headerFieldsContainer}>
        <TextField
          className={styles.field}
          id="standard-multiline-flexible"
          label="Executor"
          style={{ width: '100%' }}
          disabled={!isOnEdit}
          value={thisTeste.executor}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeTeste({ ...thisTeste, executor: event.target.value });
          }}
        />
        <div className={styles.field}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
            <KeyboardDateTimePicker
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              format="dd/MM/yyyy p"
              mask="__/__/____ __:__"
              ampm={false}
              label="Data Início"
              value={thisTeste.data_inicio}
              onChange={(date) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                // @ts-ignore
                if (date == 'Invalid Date' || date == 'Invalid time value' || date == null) return;
                onChangeTeste({
                  ...thisTeste,
                  data_inicio: formatISO(date || new Date()),
                });
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={styles.field}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
            <KeyboardDateTimePicker
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              format="dd/MM/yyyy p"
              mask="__/__/____ __:__"
              ampm={false}
              label="Data Final"
              value={thisTeste.data_final}
              onChange={(date) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                // @ts-ignore
                if (date == 'Invalid Date' || date == 'Invalid time value' || date == null) return;
                onChangeTeste({
                  ...thisTeste,
                  data_final: formatISO(date || new Date()),
                });
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <Autocomplete
          className={styles.field}
          id="combo-box-demo"
          disabled={!isOnEdit}
          value={optionsTeste.filter((option) => option.value === thisTeste.tipo_teste)[0]}
          options={optionsTeste}
          onChange={(event, newValue) => {
            // CHECK IF NEW VALUE IS PRESENT
            if (!newValue) return;

            // SET THE DATA STATE
            onChangeTeste({
              ...thisTeste,
              tipo_teste: newValue.value,
            });
          }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField
              className={styles.innerTextFiel}
              {...params}
              label="Tipo de Teste"
              margin="normal"
            />
          )}
        />
        <TextField
          className={styles.field}
          id="standard-multiline-flexible"
          label="Modelo Bomba"
          style={{ width: '100%' }}
          disabled={!isOnEdit}
          value={thisTeste.bomba_model}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeTeste({ ...thisTeste, bomba_model: event.target.value });
          }}
        />
        <div className={styles.field}>
          <FormControl>
            <InputLabel htmlFor="component-simple">Potência da Bomba</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">HP</InputAdornment>}
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              value={thisTeste.bomba_pot}
              onChange={(event) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                onChangeTeste({ ...thisTeste, bomba_pot: event.target.value });
              }}
            />
          </FormControl>
        </div>

        <div className={styles.field}>
          <FormControl>
            <InputLabel htmlFor="component-simple">Prof. Crivo Bomba</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">m</InputAdornment>}
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              value={thisTeste.pos_bomba}
              onChange={(event) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                onChangeTeste({ ...thisTeste, pos_bomba: event.target.value });
              }}
            />
          </FormControl>
        </div>
        <div className={styles.field}>
          <FormControl>
            <InputLabel htmlFor="component-simple">NE</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">m</InputAdornment>}
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              value={thisTeste.ne}
              onChange={(event) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                onChangeTeste({ ...thisTeste, ne: event.target.value });
              }}
            />
          </FormControl>
        </div>
        <div className={styles.field}>
          <FormControl>
            <InputLabel htmlFor="component-simple">Vazao final Estabilização</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
              style={{ width: '100%' }}
              disabled={!isOnEdit}
              value={thisTeste.vazao_estab_final}
              onChange={(event) => {
                // eslint-disable-next-line implicit-arrow-linebreak
                onChangeTeste({ ...thisTeste, vazao_estab_final: event.target.value });
              }}
            />
          </FormControl>
        </div>
      </div>
      <div className={styles.bombDataContainer}>
        <List component="div" disablePadding>
          <ListItem button onClick={handleBombClick}>
            {openB ? <ChevronUp /> : <ChevronDown />}
            <ListItemText primary="Bombeamento" />
          </ListItem>
        </List>
        <Collapse in={openB} timeout="auto" unmountOnExit>
          <div className={styles.bombContainer}>
            <div className={styles.tabsContainer}>
              <Tabs
                value={valueTabBomb}
                onChange={handleChangeTabBomb}
                aria-label="simple tabs example"
              >
                <Tab label="Resumo" />
                <Tab label="Dados Brutos" />
              </Tabs>
            </div>
            <TabPanel value={valueTabBomb} index={0}>
              {thisTeste.tipo_teste === 'continuo' ? (
                <ResumoContinuo
                  teste={thisTeste}
                  featureId={featureId}
                  onChangeTeste={onChangeTeste}
                  isOnEdit={isOnEdit}
                />
              ) : (
                <ResumoEscalonado
                  teste={thisTeste}
                  featureId={featureId}
                  onChangeTeste={onChangeTeste}
                  isOnEdit={isOnEdit}
                />
              )}
            </TabPanel>
            <TabPanel value={valueTabBomb} index={1}>
              <span className={styles.noFilesMsg}>Não disponível ainda</span>
            </TabPanel>
          </div>
        </Collapse>
      </div>
      <div>
        <TextField
          className={styles.field}
          multiline
          id="standard-multiline-flexible"
          label="Observação"
          style={{ width: '100%' }}
          disabled={!isOnEdit}
          value={thisTeste.obs}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeTeste({ ...thisTeste, obs: event.target.value });
          }}
        />
        {testeId && !newTeste ? (
          <div className={styles.field}>
            <FilesListAux
              fieldName="files"
              nameByPk="pocos_testes_bomb_by_pk"
              query={`
          query ($featureId: bigint!) {
            pocos_testes_bomb_by_pk(id: $featureId) {
              files
            }
          }`}
              mutation={`
            mutation ($featureId: bigint!, $changes: pocos_testes_bomb_set_input!) {
              update_pocos_testes_bomb_by_pk(pk_columns: {id: $featureId}, _set: $changes) {
                id
              }
            }
            `}
              featureId={testeId}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const DEFAULT_NEW_TESTE: testeBType = {
  id: '',
  last_modif: '',
  usr_modif: '',
  executor: '',
  bomba_model: '',
  bomba_pot: '',
  pos_bomba: '',
  data_inicio: new Date().toISOString(),
  data_final: new Date().toISOString(),
  tipo_teste: '',
  ne: '',
  vazao_estab_final: '',
  q1: '',
  r1: '',
  q2: '',
  r2: '',
  q3: '',
  r3: '',
  dados_brut_bomb: {},
  dados_brut_recup: {},
  obs: '',
  files: [],
};

const INSERT_MUTATION = `
mutation ($changes: [pocos_testes_bomb_insert_input!]!) {
  insert_pocos_testes_bomb(objects: $changes) {
    returning{
      id
    }
  }
}
`;

const UPDATE_MUTATION = `
mutation ($featureId: bigint!, $changes: pocos_testes_bomb_set_input!) {
  update_pocos_testes_bomb_by_pk(pk_columns: {id: $featureId}, _set: $changes) {
    id
  }
}
`;

const DELETE_MUTATION = `
mutation deletePocos($featureId: bigint!) {
  delete_pocos_testes_bomb_by_pk(id: $featureId) {
    id
  }
}
`;

export default ({ tableName, open, featureId, field, onResponse, ...otherProps }) => {
  const [loadingState, setLoadingState] = useState<{ loading: string; id?: number | string }>({
    loading: '',
  });
  const [loadingDeleteState, setLoadingDeleteState] = useState<number | string>('');

  const [newTeste, setNewTeste] = useState(DEFAULT_NEW_TESTE);
  const [openNew, setOpenNew] = useState(false);
  const [errorNew, setErrorNew] = useState({ error: false, msg: '' });

  const [editTeste, setEditTeste] = useState(DEFAULT_NEW_TESTE);
  const [openTeste, setOpenTeste] = useState<number | string>('');
  const [errorEdit, setErrorEdit] = useState<{ error: boolean; msg: string; id: string | number }>({
    error: false,
    msg: '',
    id: '',
  });

  const requiredFields = (teste: testeBType) => {
    const isContinuo = teste ? teste.tipo_teste !== 'continuo' : true;
    return {
      executor: true,
      bomba_model: true,
      bomba_pot: true,
      pos_bomba: true,
      data_inicio: true,
      data_final: true,
      tipo_teste: true,
      vazao_estab_final: true,
      ne: true,
      q1: true,
      r1: true,
      q2: isContinuo,
      r2: isContinuo,
      q3: isContinuo,
      r3: isContinuo,
    };
  };

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  const GET_DATA = gql`
    query GET_POCO_BY_ID($feature_id: bigint!) {
      pocos_by_pk(id: $feature_id) {
        nome
      }
      pocos_testes_bomb(where: { poco_id: { _eq: $feature_id } }, order_by: { data_final: desc }) {
        id
        last_modif
        usr_modif
        executor
        bomba_model
        bomba_pot
        pos_bomba
        data_inicio
        data_final
        tipo_teste
        ne
        vazao_estab_final
        q1
        r1
        q2
        r2
        q3
        r3
        dados_brut_bomb
        dados_brut_recup
        obs
        files
      }
    }
  `;

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    variables: {
      feature_id: featureId,
    },
  });

  const [
    insertMutation,
    { data: dataInsert, loading: loadingInsert, error: errorInsert },
  ] = useMutation(
    gql`
      ${INSERT_MUTATION}
    `,
  );
  const [
    updateMutation,
    { data: dataUpdate, loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(
    gql`
      ${UPDATE_MUTATION}
    `,
  );
  const [
    deleteMutation,
    { data: dataDelete, loading: loadingDelete, error: errorDelete },
  ] = useMutation(
    gql`
      ${DELETE_MUTATION}
    `,
  );

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  if (errorUpdate) {
    setErrorNew({ error: true, msg: 'Houve um problema ao atualizar dados de bombeamento' });
  }

  if (errorInsert) {
    setErrorEdit({
      error: true,
      msg: 'Houve um problema ao inserir o novo teste de bombeamento',
      id: openTeste,
    });
  }

  // TREAT THE DATA

  const { nome } = data.pocos_by_pk;
  const pocoTestes = data.pocos_testes_bomb;

  // handle on change of properties
  const handleSave = () => {
    const changes = { ...newTeste, last_modif: new Date().toISOString() };

    const requiredFieldsNew = requiredFields(newTeste);

    let missingFields = false;
    Object.keys(changes).forEach((key) => {
      if (requiredFieldsNew[key] && !changes[key]) {
        missingFields = true;
      }
      if (!changes[key]) {
        delete changes[key];
      }
    });

    if (missingFields) {
      setErrorNew({ error: true, msg: 'Faltam campos para serem preenchidos' });
      return;
    }

    changes['poco_id'] = featureId;

    insertMutation({
      variables: {
        changes,
      },
    });
    setLoadingState({ loading: 'INSERT' });
  };

  const handleSaveEdit = (id) => {
    const changes = { ...editTeste, last_modif: new Date().toISOString() };
    delete changes.id;
    delete changes.usr_modif;
    delete changes['__typename'];

    const requiredFieldsEdit = requiredFields(editTeste);

    let missingFields = false;
    Object.keys(changes).forEach((key) => {
      if (requiredFieldsEdit[key] && !changes[key]) {
        missingFields = true;
      }
      if (!changes[key]) {
        delete changes[key];
      }
    });

    if (missingFields) {
      setErrorEdit({ error: true, msg: 'Faltam campos para serem preenchidos', id });
      return;
    }

    updateMutation({
      variables: {
        changes,
        featureId: id,
      },
    });
    setLoadingState({ loading: 'UPDATE', id });
  };

  // HANDLER TO THE DELETE BUTTON
  const handleDelete = (id) => {
    deleteMutation({ variables: { featureId: id } });
    setLoadingDeleteState(id);
  };

  if (loadingState.loading === 'INSERT' && dataInsert) {
    setLoadingState({ loading: '' });
    setOpenNew(false);
    setNewTeste(DEFAULT_NEW_TESTE);
    refetch();
  }

  if (loadingState.loading === 'UPDATE' && dataUpdate) {
    setLoadingState({ loading: '', id: '' });
    setOpenTeste('');
    setEditTeste(DEFAULT_NEW_TESTE);
    refetch();
  }

  if (loadingDeleteState && dataDelete) {
    setLoadingDeleteState('');
    refetch();
  }

  return (
    <div>
      <FullScreenDialog
        open={open}
        onResponse={onResponse}
        btnText={null}
        title={`Testes de Bombeamento - ${nome}`}
        alwaysFull
      >
        <div className={styles.dialogContentWrapper}>
          <div className={styles.btnContainer}>
            <Button
              className={`${styles.topBtns} ${openNew ? styles.btnCancel : ''}`}
              color="primary"
              disabled={!isOnEdit}
              variant="outlined"
              onClick={() => setOpenNew(!openNew)}
              size="small"
              startIcon={openNew ? <XCircle /> : <PlusCircle />}
            >
              {openNew ? 'CANCELAR' : 'ADICIONAR'}
            </Button>
            <Button
              className={`${styles.topBtns}`}
              color="primary"
              variant="outlined"
              onClick={() => refetch()}
              size="small"
              startIcon={<RefreshCw />}
            >
              Recarregar
            </Button>
          </div>
          <Collapse in={openNew}>
            <Paper className={styles.newCollapse} elevation={3}>
              <div className={styles.newContainer}>
                <TesteBombeamentoEdit
                  teste={newTeste}
                  featureId={featureId}
                  onChangeTeste={(newTesteChange: testeBType) => {
                    setNewTeste(newTesteChange);
                  }}
                  newTeste
                  isOnEdit={isOnEdit}
                />
                <Button onClick={handleSave} color="primary" disabled={!isOnEdit}>
                  Salvar
                </Button>
                {loadingInsert && loadingState.loading === 'INSERT' ? (
                  <LinearProgress className={styles.progressBar} variant="indeterminate" />
                ) : (
                  ''
                )}
                <Snackbar
                  open={errorNew.error}
                  autoHideDuration={6000}
                  onClose={() => setErrorNew({ ...errorNew, error: false })}
                >
                  <Alert
                    onClose={() => setErrorNew({ ...errorNew, error: false })}
                    severity="error"
                  >
                    {errorNew.msg}
                  </Alert>
                </Snackbar>
              </div>
            </Paper>
          </Collapse>
          <div className={styles.listContainer}>
            {pocoTestes && pocoTestes.length > 0 ? (
              <List dense className={styles.itemContainer}>
                {pocoTestes.map((teste) => {
                  const { id, data_inicio, data_final, tipo_teste, ne, vazao_estab_final } = teste;
                  return (
                    <div>
                      <Divider />
                      <div className={styles.itemHeader}>
                        {/* todo put isOnEdit here */}
                        {isOnEdit ? (
                          <div className={styles.itemActionContainer}>
                            <div className={styles.deleteBtnWrapper}>
                              <Button
                                onClick={() => handleDelete(id)}
                                size="small"
                                disabled={!(!loadingDeleteState && loadingDeleteState !== id)}
                                aria-label="delete"
                                className={styles.deleteBtn}
                                startIcon={<Trash />}
                              >
                                Excluir
                              </Button>
                              {loadingDeleteState && loadingDeleteState == id ? (
                                <CircularProgress size={32} className={styles.deleteProgress} />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <ListItem
                        key={id}
                        className={styles.itemContainer}
                        button
                        onClick={() => {
                          setOpenTeste(openTeste !== id ? id : '');
                          setEditTeste(teste);
                        }}
                      >
                        <div className={styles.itemContainer}>
                          <div className={styles.itemDetails}>
                            <ListItemText
                              primary={
                                optionsTeste.filter((option) => option.value === tipo_teste)[0]
                                  .label
                              }
                            />
                            <span className={styles.secundaryText}>
                              Vaz. Final: {vazao_estab_final} m³/h
                            </span>
                            <span className={styles.secundaryText}>
                              Data Início:{' '}
                              {data_inicio
                                ? format(new Date(data_inicio), 'dd/MM/yyyy p', {
                                    locale: ptBR,
                                  })
                                : '-'}
                            </span>
                            <span className={styles.secundaryText}>
                              Data Final:{' '}
                              {data_final
                                ? format(new Date(data_final), 'dd/MM/yyyy p', {
                                    locale: ptBR,
                                  })
                                : '-'}
                            </span>
                            <span className={styles.secundaryText}>NE: {ne} m</span>
                          </div>
                        </div>
                      </ListItem>
                      <Collapse in={openTeste ? openTeste === id : false}>
                        <Paper className={styles.newCollapse}>
                          <div className={styles.newContainer}>
                            {openTeste && openTeste === id ? (
                              <TesteBombeamentoEdit
                                teste={editTeste}
                                featureId={featureId}
                                testeId={id}
                                onChangeTeste={(newTesteChange: testeBType) => {
                                  setEditTeste(newTesteChange);
                                }}
                                newTeste={false}
                                isOnEdit={isOnEdit}
                              />
                            ) : (
                              ''
                            )}

                            <Button onClick={() => handleSaveEdit(id)} color="primary">
                              Salvar
                            </Button>
                            {loadingUpdate &&
                            loadingState.loading === 'UPDATE' &&
                            loadingState.id == id ? (
                              <LinearProgress
                                className={styles.progressBar}
                                variant="indeterminate"
                              />
                            ) : (
                              ''
                            )}
                            <Snackbar
                              open={errorEdit.error && errorEdit.id === id}
                              autoHideDuration={6000}
                              onClose={() => setErrorEdit({ ...errorEdit, error: false })}
                            >
                              <Alert
                                onClose={() => setErrorEdit({ ...errorEdit, error: false })}
                                severity="error"
                              >
                                {errorEdit.msg}
                              </Alert>
                            </Snackbar>
                          </div>
                        </Paper>
                      </Collapse>
                    </div>
                  );
                })}
              </List>
            ) : (
              <span className={styles.noFilesMsg}>Sem registros ainda</span>
            )}
          </div>
        </div>
      </FullScreenDialog>
    </div>
  );
};
