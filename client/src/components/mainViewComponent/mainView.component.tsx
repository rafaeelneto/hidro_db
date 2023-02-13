import React, { useState } from 'react';
/* eslint-disable react/forbid-prop-types */
import { Route, Switch as RouteSwitch, useRouteMatch } from 'react-router-dom';
import { useTheme, makeStyles, Button, Tabs, Tab } from '@material-ui/core/';

import grey from '@material-ui/core/colors/grey';

import { ErrorBoundary } from 'react-error-boundary';
import { Download, RefreshCw } from 'react-feather';

import ItemView from '../itemViewComponent/itemView.component';
import NewItemComponent from '../newItemComponent/newItem.component';

import EditPanelComponent from '../editPanel/editPanel.component';

import mainFallbackComponent from '../fallbackComponent/mainFallbackComponent';

import ExportTable from '../exportComponent/exportTable.component';

// =====================================
// MODEL IMPORTATIONS
// =====================================
import tablesBundler, { TablesBundler } from '../../models/tablesBundler';

import styles from './mainView.module.scss';

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
  },
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  updateButton: {
    fill: grey[700],
    color: grey[700],
    fontWeight: 700,
  },
}));

function TabPanel(props) {
  const { children, value, index } = props;

  return <div hidden={value !== index}>{value === index ? <div>{children}</div> : ''}</div>;
}

type MainTableProps = {
  tableName: string;
};

const TableView = ({ tableName }: MainTableProps) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;

  // DEFINE STYLES
  const theme = useTheme();
  const classes = useStyles(theme);

  let queryConfiguration: any[] = [];
  if (table.customTabs) {
    queryConfiguration = table.customTabs.map((customTab) => ({
      filter: customTab.filter || '',
      orderBy: customTab.orderBy || '',
    }));
  }

  // eslint-disable-next-line radix
  const [tab, setTab] = useState(parseInt(window.location.hash.substring(1)) || 0);

  const [refetchState, setRefetch] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  const onDialogExportChange = (open) => {
    setExportDialog(open);
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
    window.location.hash = newValue;
  };

  const onRefetch = () => {
    setRefetch(false);
  };

  // TODO SET GUIDES TO MAPS AND TABLES COMPONENTS
  return (
    <div className={styles.root}>
      <div className={styles.subPageHeader}>
        <span className={styles.title}>{tableInfo.label}</span>
        <div className={styles.mainBtnsContainer}>
          <Button
            color="secondary"
            className={`${styles.actionBtns}`}
            startIcon={<RefreshCw />}
            onClick={() => setRefetch(true)}
          >
            Atualizar
          </Button>
          <Button
            color="secondary"
            className={`${styles.actionBtns}`}
            startIcon={<Download />}
            onClick={() => onDialogExportChange(true)}
          >
            Exportar
          </Button>
        </div>
        <div className={styles.editContainer}>
          <EditPanelComponent tableName={tableInfo.name} featureId={null} />
        </div>
      </div>
      <div className={classes.tableWrapper}>
        <ErrorBoundary FallbackComponent={mainFallbackComponent}>
          <div className={styles.tabsContainer}>
            <Tabs
              value={tab}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {table.customTabs?.map((customTab) => (
                <Tab label={customTab.label} />
              ))}
            </Tabs>
          </div>
          {table.customTabs?.map((customTab, index) => (
            <TabPanel value={tab} index={index}>
              <div style={{ display: 'grid', gridTemplateRows: '70vh' }}>
                {customTab.component(refetchState, onRefetch)}
              </div>
            </TabPanel>
          ))}
        </ErrorBoundary>
      </div>
      <ExportTable
        tableName={tableName}
        filters={queryConfiguration[tab].filter}
        open={exportDialog}
        onResponse={onDialogExportChange}
      />
    </div>
  );
};

export default ({ tableName }: MainTableProps) => {
  const { path } = useRouteMatch();

  return (
    <RouteSwitch>
      <Route exact path={path}>
        <TableView tableName={tableName} />
      </Route>
      <Route exact path={`${path}/new`}>
        <NewItemComponent tableName={tableName} />
      </Route>
      <Route path={`${path}/:id`}>
        <ItemView tableName={tableName} />
      </Route>
    </RouteSwitch>
  );
};
