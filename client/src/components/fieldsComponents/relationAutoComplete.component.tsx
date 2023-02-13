import React, { useState } from 'react';
import Autocomplete, { AutocompleteCloseReason } from '@material-ui/lab/Autocomplete';

import {
  TextField,
  ButtonBase,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  CircularProgress,
  Popper,
  Paper,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { XCircle, Settings } from 'react-feather';

import { gql, useQuery, useMutation } from '@apollo/client';

import LoadingComponent from '../loadingComponents/loading.component';
import { LinearProgressWithLabel } from '../loadingComponents/loadingsComponents';

import tablesNames from '../../models/tablesDefs/tablesNames';

import { RelationTable, Field } from '../../models/Interfaces';

import styles from './relationAutoComplete.module.scss';

// CONSTRUCT THE QUERY TO EXECUTE BASED ON FIELDS STATE

type valueType = {
  value: string | null;
  label: string;
};
type valueRelationType = {
  id: number;
  value: string;
};

const NULL_VALUE: valueType = { value: null, label: '<não definido>' };
const DEFAULT_ERROR_STATE = { error: true, id: '', msg: '' };

type RelationAutoCompleteProps = {
  relationTable: RelationTable;
  queryOptions: {
    tableName: string;
    query: string;
    getFunction: any;
  };
  field: Field;
  tableName: string;
  featureId: string | number;
};

export default function RelationAutoComplete({
  relationTable,
  queryOptions,
  field,
  tableName,
  featureId,
}: RelationAutoCompleteProps) {
  const toTable = tablesNames[queryOptions.tableName];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [loadingState, setLoadingState] = useState(false);
  const [deleteLoadingState, setDeleteLoadingState] = useState('');
  const [error, setError] = useState(DEFAULT_ERROR_STATE);

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  let options: valueType[] = [NULL_VALUE];
  let selectedOptionsData: valueRelationType[] = [];
  let selectedOptions: valueType[] = [];

  const GET_DATA_OPTIONS = gql`
    ${queryOptions.query}
  `;

  // PREPARE THE QUERY TO FETCH THE RELATION DATA
  const GET_DATA_RELATION = gql`
    ${relationTable.query2(tableName)()}
  `;

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data: dataOptions, loading: loadingOptions, error: errorOptions } = useQuery(
    GET_DATA_OPTIONS,
    {
      // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
      skip: !queryOptions,
    },
  );

  const { data: dataRelation, loading: loadingRelation, refetch } = useQuery(GET_DATA_RELATION, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    skip: !queryOptions,
    variables: {
      feature_id: featureId,
    },
  });

  const [insertRelation, { data: dataInsert }] = useMutation(
    gql`
      ${relationTable.insert.query}
    `,
  );
  const [deleteRelation, { data: dataDelete }] = useMutation(
    gql`
      ${relationTable.delete.query}
    `,
  );

  // MAKE THE DATA TREATMENT OF THE RECEIVED GRAPHQL DATA
  if (queryOptions && featureId !== 'new') {
    if (loadingOptions || loadingRelation) return <LoadingComponent />;
    if (errorOptions) return <h1>Erro na aplicação</h1>;
    options = dataOptions[queryOptions.tableName].map(queryOptions.getFunction);

    // DATA TREATMENT TO SHOW ALL THE AVAILABLE OPTIONS
    selectedOptionsData = dataRelation[relationTable.name].map((item) => ({
      id: item.id,
      value: item[relationTable.getColumnName(tableName)],
    }));

    selectedOptions = options.filter((option) =>
      selectedOptionsData.find((item) => option.value === item.value),
    );
  }

  const handleDelete = (deleteValue) => {
    const fieldsToDelete = selectedOptionsData.filter((item) => {
      if (deleteValue === item.value) return true;
      return false;
    });
    const deleteId = fieldsToDelete[0].id;

    deleteRelation({
      variables: relationTable.delete.getMutationObj(deleteId),
    });
    setDeleteLoadingState(deleteValue);
  };

  // HANDLE THE CHANGE OF THE RELATION
  const handleChange = (event, newValue: valueType[]) => {
    // CHECK IF NEW VALUE IS PRESENT
    if (!newValue) return;

    if (selectedOptions.length < newValue.length) {
      // INSERT MUTATION

      const ids = {};
      ids[relationTable.getColumnName(queryOptions.tableName)] = `${featureId}`;

      newValue.forEach((i) => {
        if (selectedOptions.length === 0) {
          ids[relationTable.getColumnName(tableName)] = i.value;
        }

        selectedOptions.forEach((optionDefault) => {
          if (optionDefault.value !== i.value) {
            ids[relationTable.getColumnName(tableName)] = i.value;
          }
        });
      });

      const objectMutation = relationTable.insert.getMutationObj(ids);

      insertRelation({
        variables: {
          objects: [objectMutation],
        },
      });
      setLoadingState(true);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = (event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) => {
    if (reason === 'toggleInput') {
      return;
    }
    if (anchorEl) {
      anchorEl.focus();
    }

    setAnchorEl(null);
    setOpen(false);
  };

  if ((loadingState && dataInsert) || (deleteLoadingState && dataDelete)) {
    // store that the data has been updated
    setLoadingState(false);
    setDeleteLoadingState('');
    refetch();
  }

  return (
    <div className={styles.fieldWrapper}>
      <Typography variant="button" display="block" gutterBottom>
        {field.label}
      </Typography>
      {isOnEdit ? (
        <ButtonBase
          disableRipple
          disabled={!isOnEdit}
          className={styles.button}
          onClick={handleClick}
        >
          <span>Adicionar relação</span>
          <Settings className={styles.settingIcon} />
        </ButtonBase>
      ) : (
        ''
      )}

      <Popper
        open={open && isOnEdit}
        anchorEl={anchorEl}
        placement="bottom-start"
        className={styles.popper}
      >
        <Paper elevation={2}>
          <Autocomplete
            onClose={handleClose}
            className={styles.autoComplete}
            id="multi_select"
            multiple
            filterSelectedOptions
            value={selectedOptions}
            options={options}
            onChange={handleChange}
            renderTags={() => null}
            disabled={!isOnEdit || featureId === 'new'}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField {...params} label={field.label} />
            )}
          />
        </Paper>
      </Popper>
      <List dense>
        {selectedOptions.length > 0 ? (
          selectedOptions.map((selectedOption) => {
            const { label, value } = selectedOption;
            return (
              <ListItem
                className={styles.listItem}
                key={value}
                button
                component={Link}
                to={toTable.getLink(value)}
              >
                {label}

                {isOnEdit ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleDelete(value)}
                      aria-label="delete"
                      className={styles.deleteBtn}
                    >
                      <XCircle />
                    </IconButton>
                    {deleteLoadingState === value && (
                      <CircularProgress size={32} className={styles.deleteProgress} />
                    )}
                  </ListItemSecondaryAction>
                ) : (
                  ''
                )}
              </ListItem>
            );
          })
        ) : (
          <span className={styles.noFilesMsg}>Nao há relações definidas</span>
        )}
        {loadingState ? (
          <ListItem className={styles.progressBar}>
            <LinearProgressWithLabel
              className={styles.progressBar}
              value={0}
              variant="indeterminate"
            />
          </ListItem>
        ) : (
          ''
        )}
        {error.error && error.id === '' ? <span className={styles.errorMsg}>{error.msg}</span> : ''}
      </List>
    </div>
  );
}
