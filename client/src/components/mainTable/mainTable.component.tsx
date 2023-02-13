import React, { useEffect, useState } from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';

import { Button, Checkbox, Menu, MenuItem, TableSortLabel } from '@material-ui/core/';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { useQuery } from '@apollo/client';

import LoadingComponent from '../loadingComponents/loading.component';

// =====================================
// MODEL IMPORTATIONS
// =====================================
import { mainFeature, gisFeature } from '../../models/Interfaces';
import { Order } from '../../models/Interfaces';

// =====================================
// DATA STATE MANAGER
// =====================================
import { useSelectedItems, useHistoryState } from '../../utils/dataState.manager';

import { useMutationItem } from '../../graphql/fetchMutation';

import styles from './mainTable.module.scss';

const composeDataTableObject = (tableName, table, fieldsState, data) => {
  const validFields = fieldsState.filter((field) => field.present);
  let rows = data[tableName];

  rows = rows.map((row) => {
    const newRow = { ...row };
    validFields.forEach((field) => {
      const value = table.fields.get(field.name).getValue(row);
      if (value) {
        newRow[field.name] = value.label;
      } else {
        newRow[field.name] = '-';
      }
    });
    return newRow;
  });

  return {
    headers: validFields,
    rows,
  };
};

const initialMenuState: { mouseX: null | number; mouseY: null | number } = {
  mouseX: null,
  mouseY: null,
};

type MainTableProps = {
  filters?: string;
  orderBy?: string;
  order?: Order;
  tableName: string;
  table: mainFeature | gisFeature;
  doRefetch: boolean;
  onRefetch: Function;
};

const MainTable = ({
  filters = '',
  orderBy = '',
  order = undefined,
  tableName,
  table,
  doRefetch,
  onRefetch,
}: MainTableProps) => {
  const history = useHistory();
  const { path } = useRouteMatch();

  const [allSelect, setAllSelect] = useState(false);

  const [orderState, setOrderState] = useState<Order>(order);
  const [orderByState, setOrderByState] = useState(orderBy);
  const [customOrderState, setCustomOrderState] = useState({
    field: '',
    customOrder: (orderCustom: string) => `${order}`,
  });

  const [fieldsMenu, setSetFieldsMenu] = useState(initialMenuState);

  // CALL FUNCTION TO DEFINE FIELDS STATE TO QUERY AND TO SHOW
  const [fieldsState, setFieldsState] = useState(table.defaultFieldsState);

  const handleRequestSort = (property, customOrder?) => {
    const isAsc = orderByState === property && orderState === 'asc';

    if (customOrder) {
      setCustomOrderState({ field: property, customOrder });
    }

    setOrderState(isAsc ? 'desc' : 'asc');
    setOrderByState(property);
  };

  const { getSelectedItems, addSelectedItems, removeSelectedItems, removeAllSelectedItems } =
    useSelectedItems();

  const { checkState } = useHistoryState();

  // SET TABLE's STATE VARIABLES AND HANDLE CHANGES ON PAGE
  const [tableSelectorHidden, setTableSelectorHidden] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const count = table.statistics.count(filters);

  const [refetchData, setRefetchData] = useState(false);

  const onMutationListener = () => {
    setRefetchData(true);
  };

  const { attach, detach } = useMutationItem(tableName, table);

  useEffect(() => {
    attach(onMutationListener);

    // TODO: CHECK THIS PART TO IMPLEMENT A WAY TO UPDATE TABLE AFTER A CRIATION OF A ITEM
    // return () => detach(onMutationListener);
  }, []);

  // QUERY DATA WITH APOLLO CLIENT
  // ================= NEEDS TO QUERY THE COUNT OF ROWS ========================

  const orderStateSuffix = orderState === 'desc' ? '_nulls_last' : '_nulls_first';

  const orderString =
    orderByState && orderState
      ? `order_by: { ${orderByState}: ${
          orderByState === customOrderState.field
            ? customOrderState.customOrder(`${orderState}${orderStateSuffix}`)
            : `${orderState}${orderStateSuffix}`
        }}`
      : '';

  const { data, loading, error, refetch, client } = useQuery(
    table.composeTableQuery(fieldsState, filters, orderString),
    {
      variables: {
        limit,
        offset,
      },
    },
  );

  if (loading) return <LoadingComponent />;
  if (error) {
    throw error;
  }

  if (refetchData) {
    refetch();
    setRefetchData(false);
  }

  // COMPOSE TABLE OBJECT AND DATA TREATMENT
  const dataTable = composeDataTableObject(tableName, table, fieldsState, data);

  if (doRefetch) {
    refetch();
    onRefetch();
  }

  const selectedItems = getSelectedItems(tableName);

  // TODO check a alternative to implement the select all feature
  if (selectedItems.length >= dataTable.rows.length) {
    const isSelected = dataTable.rows.every(({ id }) => selectedItems.includes(id));
    if (isSelected && !allSelect) setAllSelect(true);
  }

  const checkItemSelect = (id) => selectedItems.includes(id);

  const onCheckAllItems = (event) => {
    if (allSelect) {
      removeAllSelectedItems(tableName);
    } else {
      const allIds = dataTable.rows.map((row) => row.id);
      addSelectedItems(tableName, allIds);
    }
    setAllSelect(!allSelect);
  };

  const checkFieldSelected = (index) => fieldsState[index].present;

  const onContextClick = (event) => {
    event.preventDefault();
    setSetFieldsMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };
  const onMenuClose = () => {
    setSetFieldsMenu(initialMenuState);
  };

  const handlePageChange = (event, newPage) => {
    setOffset(newPage > 0 ? newPage * limit : 0);
    setPage(newPage);
    setAllSelect(false);
  };

  const handleFieldChange = (index) => {
    // eslint-disable-next-line prefer-const
    let tmpFields = [...fieldsState];
    let tmpField = fieldsState[index];
    tmpField = {
      ...tmpField,
      present: !tmpField.present,
    };
    tmpFields[index] = tmpField;
    setFieldsState(tmpFields);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={styles.tableWrapper}>
      <TableContainer className={styles.tableContainer} component={Paper}>
        <Table className={styles.table} stickyHeader size="small" aria-label="simple table">
          <TableHead onContextMenu={onContextClick}>
            <TableRow>
              <TableCell key="select-all-checkbox" style={{ width: '40px' }}>
                <Checkbox
                  checked={allSelect}
                  onChange={onCheckAllItems}
                  inputProps={{ 'aria-labelledby': 'Selecionar todos' }}
                />
              </TableCell>
              {dataTable.headers.map((field) => {
                if (field.dontOrder) {
                  return (
                    <TableCell
                      key={field.name}
                      className={`${styles.tableCell} ${field.isMain ? styles.mainCell : ''}`}
                    >
                      {field.label}
                    </TableCell>
                  );
                }
                return (
                  <TableCell
                    key={field.name}
                    className={`${styles.tableCell} ${field.isMain ? styles.mainCell : ''}`}
                  >
                    <TableSortLabel
                      active={orderByState === field.name}
                      direction={orderByState === field.name ? orderState : 'asc'}
                      onClick={(event) => {
                        if (field.customOrder) {
                          return handleRequestSort(field.name, field.customOrder);
                        }
                        handleRequestSort(field.name);
                      }}
                    >
                      {field.label}
                      {orderByState === field.name ? (
                        <span className={styles.visuallyHidden}>
                          {orderState === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
            <Menu
              keepMounted
              open={fieldsMenu.mouseY !== null}
              onClose={onMenuClose}
              anchorReference="anchorPosition"
              anchorPosition={
                fieldsMenu.mouseY !== null && fieldsMenu.mouseX !== null
                  ? { top: fieldsMenu.mouseY, left: fieldsMenu.mouseX }
                  : undefined
              }
            >
              {fieldsState.map((field, index) => (
                <MenuItem key={field.name}>
                  <Checkbox
                    checked={checkFieldSelected(index)}
                    onChange={() => {
                      handleFieldChange(index);
                    }}
                  />
                  {field.label}
                </MenuItem>
              ))}
            </Menu>
          </TableHead>
          <TableBody className={styles.tableBody}>
            {dataTable.rows.map((row) => {
              const isItemSelected = checkItemSelect(row.id);
              const isModified = checkState(tableName, row.id);
              return (
                <TableRow
                  key={row.id}
                  className={`${styles.bodyRow} ${isModified ? styles.modifiedRow : ''}`}
                >
                  <TableCell key={`${row.id} checkbox`} style={{ width: '40px' }}>
                    <Checkbox
                      checked={isItemSelected}
                      onChange={(event) => {
                        if (isItemSelected) {
                          removeSelectedItems(tableName, [row.id]);
                          return;
                        }
                        addSelectedItems(tableName, [row.id]);
                      }}
                    />
                  </TableCell>
                  {dataTable.headers.map((field) => (
                    <TableCell
                      key={field.label + row.id}
                      className={`${styles.tableCell} ${field.isMain ? styles.mainCell : ''}`}
                    >
                      {row[field.name]}
                      {field.isMain ? (
                        <Button
                          key={field.label + row.id}
                          className={styles.btnRow}
                          size="small"
                          onClick={() => history.push(`${path}/${row.id}`)}
                        >
                          Abrir detalhes
                        </Button>
                      ) : (
                        ''
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MainTable;
