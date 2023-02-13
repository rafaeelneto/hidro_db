import React, { useState } from 'react';

import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx/dist/xlsx.mini.min';

import {
  Button,
  Checkbox,
  Divider,
  ButtonGroup,
  Popper,
  Paper,
  Grow,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from '@material-ui/core/';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { convert2GeoJsonKml } from '../../utils/geoJsonConverter';
import tokml from 'tokml';
import download from 'downloadjs';

import { useLazyQuery } from '@apollo/client';

import { ChevronDown } from 'react-feather';

import { ReactComponent as TableIcon } from '../../assets/icons/table_icon-01.svg';
import { ReactComponent as EarthIcon } from '../../assets/icons/earth_icon-01.svg';

import FullScreenDialog from '../dialogs/fullScreenDialog.component';
// =====================================
// MODEL IMPORTATIONS
// =====================================
import tablesBundler, { TablesBundler } from '../../models/tablesBundler';

import { fieldStateType, Field, mainFeature, gisFeature } from '../../models/Interfaces';

// =====================================
// DATA STATE MANAGER
// =====================================
import { useSelectedItems } from '../../utils/dataState.manager';

import styles from './exportTable.module.scss';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// Desired file extesion
const fileExtension = '.xlsx';

export const exportToSpreadsheet = (data, fileName) => {
  import('xlsx').then((xlsx) => {
    // do something with xlsx
    const XLSX = xlsx;
    // Create a new Work Sheet using the data stored in an Array of Arrays.
    const workSheet = XLSX.utils.aoa_to_sheet(data);
    // Generate a Work Book containing the above sheet.
    const workBook = {
      Sheets: { data: workSheet, cols: [] },
      SheetNames: ['data'],
    };
    // Exporting the file with the desired name and extension.
    const excelBuffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(fileData, fileName + fileExtension);
  });
};

const composeDataTableArray = (tableName, table, fieldsState: fieldStateType, data) => {
  if (!data) return;

  const validFields = fieldsState.filter((field) => field.present);
  const array: string[][] = [];

  array.push(validFields.map((field) => (field.labelExport ? field.labelExport : field.label)));

  const rows = data[tableName];

  rows.forEach((row) => {
    array.push(
      validFields.map((field) => {
        const fieldObj: Field = table.fields.get(field.name);

        if (fieldObj.getValueToExport) {
          return fieldObj.getValueToExport(row);
        }

        if (!fieldObj.getValue) return '-';

        const value = fieldObj.getValue(row);
        if (!value) return '-';

        return value.label;
      }),
    );
  });

  return array;
};

const composeDataGeoArray = (tableName, table, fieldsState: fieldStateType, data) => {
  if (!data) return null;

  const validFields = fieldsState.filter((field) => field.present);
  let rows = data[tableName];

  rows = rows.map((row) => {
    const newRow = {};
    validFields.forEach((field) => {
      if (field.name === 'geom') {
        newRow['geom'] = row.geom;
      }

      const label = field.labelExport || field.label;
      let value = '-';

      const fieldObj: Field = table.fields.get(field.name);

      if (fieldObj.getValueToExport) {
        value = fieldObj.getValueToExport(row);
      } else if (!fieldObj.getValueToExport && fieldObj.getValue) {
        const rowValue = fieldObj.getValue(row);
        if (rowValue) {
          value = rowValue.label;
        }
      }

      if (value) {
        newRow[label] = value;
      } else {
        newRow[label] = '-';
      }
    });
    return newRow;
  });

  return rows;
};

const exportOptions = ['Exportar .xlsx', 'Exportar .kml'];

const ExportTable = ({ tableName, filters }) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table: gisFeature | mainFeature = tableInfo.instance;

  // @ts-ignore
  const geometryType = table.geometryType || null;

  // CALL FUNCTION TO DEFINE FIELDS STATE TO QUERY AND TO SHOW
  const [fieldsState, setFieldsState] = useState(table.defaultFieldsState);
  const [exportRange, setExportRange] = useState('all');
  const [downloading, setDownloading] = useState(false);
  const [exportType, setExportType] = useState(0);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const { getSelectedItems } = useSelectedItems();

  const selectedItems = getSelectedItems(tableName);

  let selectionFilters = filters;

  if (selectedItems.length > 0) {
    const f = filters.slice(0, -1);
    selectionFilters = `${f ? `${f}, ` : 'where: {'} id: {_in: [${selectedItems}]}}`;
  }

  // SET TABLE's STATE VARIABLES AND HANDLE CHANGES ON PAGE
  const count = table.statistics.count(filters);

  // QUERY DATA WITH APOLLO CLIENT
  // ================= NEEDS TO QUERY THE COUNT OF ROWS ========================
  const [getData, { loading, data, error }] = useLazyQuery(
    table.composeTableQuery(fieldsState, filters),
  );

  const [
    getDataSelection,
    { loading: loadingSelection, data: dataSelection, error: errorSelection },
  ] = useLazyQuery(table.composeTableQuery(fieldsState, selectionFilters));

  if (error) {
    throw error;
  }
  if (errorSelection) {
    throw errorSelection;
  }
  if (error) {
    throw error;
  }

  const handleConfirm = () => {
    if (selectedItems.length && selectedItems.length > 0) {
      getDataSelection({
        variables: {
          limit: count,
          offset: 0,
        },
      });
    } else {
      getData({
        variables: {
          limit: count,
          offset: 0,
        },
      });
    }

    setDownloading(true);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    if (index === 1 && geometryType) {
      const tmpFields = [...fieldsState];
      let fieldIndex = 0;
      let tmpField = fieldsState.filter((fieldState, i) => {
        if (fieldState.name === 'geom') {
          fieldIndex = i;
          return true;
        }
        return false;
      })[0];
      tmpField = {
        ...tmpField,
        present: true,
      };
      tmpFields[fieldIndex] = tmpField;
      setFieldsState(tmpFields);
    }
    setExportType(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef && anchorRef.current) {
      return;
    }

    setOpen(false);
  };

  if ((data || dataSelection) && downloading) {
    let dataArray;
    if (selectedItems.length && selectedItems.length > 0) {
      dataArray = composeDataTableArray(tableName, table, fieldsState, dataSelection);
    } else {
      dataArray = composeDataTableArray(tableName, table, fieldsState, data);
    }

    if (exportType === 0) {
      exportToSpreadsheet(dataArray, tableName);
    } else if (exportType === 1 && geometryType) {
      if (data && data[tableName]) {
        let geoDataArray;
        if (selectedItems.length && selectedItems.length > 0) {
          geoDataArray = composeDataGeoArray(tableName, table, fieldsState, dataSelection);
        } else {
          geoDataArray = composeDataGeoArray(tableName, table, fieldsState, data);
        }

        const geoJsonData = convert2GeoJsonKml(geoDataArray, geometryType);
        const kml = tokml(geoJsonData);

        download(kml, `${tableInfo.label}.kml`, 'text/html');
      }
    }

    setDownloading(false);
  }

  const selectAllItems = (all) => {
    setFieldsState(fieldsState.map((field) => ({ ...field, present: all })));
  };

  const checkFieldSelected = (index) => fieldsState[index].present;

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

  const handleExportRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportRange((event.target as HTMLInputElement).value);
  };

  return (
    <div className={styles.container}>
      <div>
        <Backdrop className={styles.backdrop} open={downloading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className={`${styles.optionsContainer}`}>
          Selecione os campos para exportação
          <List dense>
            {fieldsState.map((field, index) => {
              let shouldDisable = false;
              if (geometryType && exportType === 1 && field.name === 'geom') {
                shouldDisable = true;
              }
              return (
                <ListItem key={field.name}>
                  <Checkbox
                    disabled={shouldDisable}
                    checked={checkFieldSelected(index)}
                    onChange={() => {
                      handleFieldChange(index);
                    }}
                  />
                  {field.label}
                </ListItem>
              );
            })}
          </List>
          <div className={styles.selectAllCheckbox}>
            <Button className={styles.btn} variant="outlined" onClick={() => selectAllItems(true)}>
              SELECIONAR TODOS
            </Button>
            <Button className={styles.btn} variant="outlined" onClick={() => selectAllItems(false)}>
              DESSELECIONAR TODOS
            </Button>
          </div>
        </div>
        <Divider />
        <div className={`${styles.optionsContainer}`}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Quais itens você quer exportar</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="itens"
              value={exportRange}
              onChange={handleExportRangeChange}
            >
              <FormControlLabel value="all" control={<Radio />} label={`Todos (${count} itens)`} />
              <FormControlLabel
                disabled={selectedItems.length === 0}
                value="selection"
                control={<Radio />}
                label={`Apenas selecionados (${selectedItems.length} itens)`}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <Divider />
        <div className={`${styles.optionsContainer} ${styles.btnContainer}`}>
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button
              className={styles.btnExport}
              onClick={handleConfirm}
              startIcon={exportType === 0 ? <TableIcon /> : <EarthIcon />}
            >
              {exportOptions[exportType]}
            </Button>
            <Button
              className={styles.btnExport}
              disabled={!geometryType}
              color="primary"
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ChevronDown />
            </Button>
          </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu">
                      {exportOptions.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === exportType}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default ({ tableName, open, filters, onResponse, ...otherProps }) => (
  <div>
    <FullScreenDialog open={open} onResponse={onResponse} btnText={null} title="Exportar dados">
      <ExportTable tableName={tableName} filters={filters} />
    </FullScreenDialog>
  </div>
);
