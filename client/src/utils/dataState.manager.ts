import { useReactiveVar } from '@apollo/client';
import { dataStateVar } from '../graphql/cache';

// * ==============================================================
// * DEFINE THE DATA STATE GET FUNCTION TO BE USED BY THE BELOW HOOKS
// * DEFINE THE SAVING THE TABLE STATE INTO THE APOLLO CLIENT CACHE
// * ==============================================================

// TODO CHANGE THE NAME OF THIS FUNCTION
export const useDataState = () => {
  let state = useReactiveVar(dataStateVar);

  const getState = (tableName: string, id: number | string | null) => {
    if (!state[tableName]) {
      const newState = { ...state };
      newState[tableName] = { selectedItems: [] };
      dataStateVar(newState);
      state = newState;
    }

    if (id && !state[tableName][id]) {
      const newState = { ...state };
      const tableState = { ...newState[tableName] };
      tableState[id] = new Map<number, any>();
      newState[tableName] = tableState;
      dataStateVar(newState);
      state = newState;
    }

    return [{ ...state }, { ...state[tableName] }];
  };

  const checkState = (tableName: string, id: number | string | null) => {
    if (!state[tableName]) return false;
    if (!state[tableName][id]) return false;
    if (!(state[tableName][id].size > 1)) return false;
    return true;
  };

  return { getState, checkState };
};

const saveTableState = (tableName: string, oldState: any, newTableState: any) => {
  const newState = { ...oldState };
  newState[tableName] = newTableState;

  // 1) SAVE STATE OBJECT CLIENT DATA

  dataStateVar(newState);
};

// * ==============================================================
// * MANAGES THE HISTORY OF MODIFICATIONS OF THE FIELDS
// * ==============================================================

export const useHistoryState = () => {
  const { getState, checkState } = useDataState();

  const addHistoryItem = (tableName: string, id: number | string, newItemState) => {
    // 1) GET LIST OBJECT FROM STATE
    const [state, tableState] = getState(tableName, id);

    // 2) ADD THE STATE TO THE LIST
    const itemStateHistory: Map<number, any> = tableState[id];
    const keys = Array.from(itemStateHistory.keys());
    const lastKey = keys.pop() ?? 0;
    tableState[id] = itemStateHistory.set(lastKey + 1, newItemState);

    // 3) SAVE STATE OBJECT CLIENT DATA
    saveTableState(tableName, state, tableState);
  };

  const removeHistoryLastItem = (tableName: string, id: number | string) => {
    // 1) GET LIST OBJECT FROM STATE
    const [state, tableState] = getState(tableName, id);

    // 2) REMOVE THE STATE TO THE LIST
    const itemStateHistory: Map<number, any> = tableState[id];
    const keys = Array.from(itemStateHistory.keys());
    const lastKey = keys.pop() ?? 1;
    itemStateHistory.delete(lastKey);

    tableState[id] = itemStateHistory;

    // 3) SAVE STATE OBJECT CLIENT DATA
    saveTableState(tableName, state, tableState);
  };

  const setHistoryOriginal = (tableName: string, id: number | string, originalState) => {
    // 1) GET LIST OBJECT FROM STATE
    const [state, tableState] = getState(tableName, id);

    // 2) SET THE ORIGINAL STATE TO STATE HISTORY
    const itemStateHistory: Map<number, any> = tableState[id];
    tableState[id] = itemStateHistory.set(0, originalState);

    // 3) SAVE STATE OBJECT CLIENT DATA
    saveTableState(tableName, state, tableState);
  };

  const resetHistory = (tableName: string, id: number | string, all: boolean) => {
    // 1) GET LIST OBJECT FROM STATE
    const [state, tableState] = getState(tableName, id);
    const newTableState = { ...tableState };

    // 2) EMPTY LIST OF STATES
    const itemStateHistory: Map<number, any> = newTableState[id];
    const originalState = itemStateHistory.get(0);
    itemStateHistory.clear();
    if (!all) {
      itemStateHistory.set(0, originalState);
    } else {
      delete newTableState[id];
    }
    newTableState[id] = itemStateHistory;

    // 3) SAVE STATE OBJECT CLIENT DATA
    saveTableState(tableName, state, newTableState);
  };

  const getHistoryLastItem = (tableName: string, id: number | string) => {
    // 1) GET LIST OBJECT FROM STATE
    const [, tableState] = getState(tableName, id);

    // 2) GET THE STATE LIST
    const itemStateHistory: Map<number, any> = tableState[id];

    // 3) RETURN THE LAST ELEMENT OF THE ARRAY
    return Array.from(itemStateHistory.values()).pop();
  };

  const getHistoryLastKey = (tableName: string, id: number | string) => {
    // 1) GET LIST OBJECT FROM STATE
    const [, tableState] = getState(tableName, id);

    // 2) GET THE STATE LIST
    const itemStateHistory: Map<number, any> = tableState[id];

    // 3) RETURN THE LAST ELEMENT OF THE ARRAY
    return Array.from(itemStateHistory.keys()).pop() ?? 0;
  };

  return {
    addHistoryItem,
    removeHistoryLastItem,
    setHistoryOriginal,
    resetHistory,
    getHistoryLastItem,
    getHistoryLastKey,
    checkState,
  };
};

// * ==============================================================
// * MANAGES THE SELECTED ITEMS IN EACH MAIN TABLE VIEW
// * ==============================================================

export const useSelectedItems = () => {
  const { getState } = useDataState();

  const getSelectedItems = (tableName: string): number[] => {
    const [, tableState] = getState(tableName, null);

    // 1) RETURN THE ARRAY OF SELECTED ITEMS FOR THE SPECIFIED TABLE
    return tableState.selectedItems;
  };

  const addSelectedItems = (tableName: string, items: number[]) => {
    const [state, tableState] = getState(tableName, null);

    const itemsSelectedList = tableState.selectedItems;

    const verifiedItems = items.filter((item) => itemsSelectedList.indexOf(item) < 0);

    tableState.selectedItems = [...itemsSelectedList, ...verifiedItems];

    saveTableState(tableName, state, tableState);
  };

  const removeSelectedItems = (tableName: string, items: number[]) => {
    const [state, tableState] = getState(tableName, null);

    const itemsSelectedList = tableState.selectedItems;

    tableState.selectedItems = itemsSelectedList.filter((item) => items.indexOf(item) < 0);

    saveTableState(tableName, state, tableState);
  };

  const removeAllSelectedItems = (tableName: string) => {
    const [state, tableState] = getState(tableName, null);

    tableState.selectedItems = [];

    saveTableState(tableName, state, tableState);
  };

  return {
    getSelectedItems,
    addSelectedItems,
    removeSelectedItems,
    removeAllSelectedItems,
  };
};
