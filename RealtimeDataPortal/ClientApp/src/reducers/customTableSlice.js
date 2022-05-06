import { createSlice } from "@reduxjs/toolkit";

const cell = {
    id: 0,
    idTable: 0,
    typeCell: 'text',
    cellContain: '123',
    rowNumber: 0,
    columnNumber: 0,
    cellStyle: {}
};

const row = [cell];

const table = {
    customTableId: 0,
    componentId: 0,
    name: '',
    rows: [row]
};

const initialState = {
    tables: [table],
    focusedElement: undefined
};

const customTableSlice = createSlice({
    name: 'customSlice',
    initialState,
    reducers: {
        addTable: (state) => {
            state.tables.push(table);
        },
        removeTable: (state, action) => {
            state.tables.splice(action.payload, 1);
        },
        inputName: (state, action) => {
            state.tables[action.payload.indexTable].name = action.payload.value;
        },
        addRow: (state, action) => {
            const addingRow = new Array(state.tables[action.payload].rows[0].length).fill(cell);
            state.tables[action.payload].rows.push(addingRow);
        },
        deleteRow: (state, { payload: { indexTable, indexRow } }) => {
            state.tables[indexTable].rows.splice(indexRow, 1);
        },
        addColumn: (state, action) => {
            state.tables[action.payload].rows.forEach((_, index) => {
                state.tables[action.payload].rows[index].push(cell);
            });
        },
        deleteColumn: (state, { payload: { indexTable, indexColumn } }) => {
            state.tables[indexTable].rows.forEach(row => {
                row.splice(indexColumn, 1);
            });
        },
        inputCellContain: (state, { payload: { indexTable, indexRow, indexCell, cellContain, typeCell } }) => {
            state.tables[indexTable].rows[indexRow][indexCell].cellContain = cellContain;
            state.tables[indexTable].rows[indexRow][indexCell].typeCell = typeCell;
        },
        getFocusedElement: (state, { payload: { indexTable, indexRow, indexCell } }) => {
            state.focusedElement = {
                indexTable,
                indexRow,
                indexCell,
                cellContain: state.tables[indexTable].rows[indexRow][indexCell]?.cellContain
            }
        },
        resetFocusedElemet: (state) => {
            state.focusedElement = undefined
        }
    }
});

const { actions, reducer } = customTableSlice;

export default reducer;

export const {
    addTable
    , removeTable
    , inputName
    , addRow
    , addColumn
    , inputCellContain
    , getFocusedElement
    , resetFocusedElemet
    , deleteRow
    , deleteColumn
} = actions;