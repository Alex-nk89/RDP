import { createSlice } from "@reduxjs/toolkit";

const cell = {
    id: 0,
    rowId: 0,
    typeCell: 'text',
    cellContain: JSON.stringify({
        value: '',
        tagId: 0,
        tagName: '',
        productId: 0,
        round: 0
    }),
    cellStyle: JSON.stringify({
        fontWeight: 400,
        textAlign: 'start'
    })
};

const row = {
    rowId: 0,
    customTableId: 0,
    cells: [cell]
};

const table = {
    customTableId: 0,
    componentId: 0,
    customTableName: '',
    rows: [row]
};

const initialState = {
    tables: [table],
    focusedElement: undefined,
    statusFetcing: 'idle',
    title: '',
    tagsIds: [],
    tagsLiveValues: []
};

const customTableSlice = createSlice({
    name: 'customSlice',
    initialState,
    reducers: {
        initializeTables: (state, action) => {
            state.tables = action.payload;
        },
        addTable: (state) => {
            state.tables.push(table);
        },
        removeTable: (state, action) => {
            state.tables.splice(action.payload, 1);
        },
        inputName: (state, action) => {
            state.tables[action.payload.indexTable].customTableName = action.payload.value;
        },
        addRow: (state, action) => {
            const addingRow = {
                rowId: 0,
                customTableId: 0,
                cells: new Array(state.tables[action.payload].rows[0].cells.length).fill(cell)
            };
            state.tables[action.payload].rows.push(addingRow);
        },
        deleteRow: (state, { payload: { indexTable, indexRow } }) => {
            state.tables[indexTable].rows.splice(indexRow, 1);
        },
        addColumn: (state, action) => {
            state.tables[action.payload].rows.forEach((_, index) => {
                state.tables[action.payload].rows[index].cells.push(cell);
            });
        },
        deleteColumn: (state, { payload: { indexTable, indexColumn } }) => {
            state.tables[indexTable].rows.forEach(row => {
                row.cells.splice(indexColumn, 1);
            });
        },
        inputCellContain: (state, { payload: { indexTable, indexRow, indexCell, cellContain, typeCell } }) => {
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellContain = cellContain;
            state.tables[indexTable].rows[indexRow].cells[indexCell].typeCell = typeCell;
        },
        inputCellStyle: (state, { payload: { indexTable, indexRow, indexCell, cellStyle }}) => {
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle = cellStyle;
        },
        getFocusedElement: (state, { payload: { indexTable, indexRow, indexCell } }) => {
            state.focusedElement = {
                indexTable,
                indexRow,
                indexCell,
                cellContain: state.tables[indexTable].rows[indexRow].cells[indexCell]?.cellContain
            }
        },
        resetFocusedElemet: (state) => {
            state.focusedElement = undefined
        },
        fetchingCustomTableEnd: (state) => {
            state.statusFetcing = 'idle';
        },
        fetchingCustomTable: (state) => {
            state.statusFetcing = 'loading';
        },
        fetchingCustomTableError: (state) => {
            state.statusFetcing = 'error';
        },
        initialTitle: (state, action) => {
            state.title = action.payload
        },
        initialTagsIds: (state, action) => {
            state.tagsIds = action.payload
        },
        initialTagsLiveValues: (state, action) => {
            state.tagsLiveValues = action.payload
        }
        //resetState: (state) => {
        //    state = initialState;
        //}
    }
});

const { actions, reducer } = customTableSlice;

export default reducer;

export const {
    initializeTables
    , addTable
    , removeTable
    , inputName
    , addRow
    , addColumn
    , inputCellContain
    , getFocusedElement
    , resetFocusedElemet
    , deleteRow
    , deleteColumn
    , fetchingCustomTable
    , fetchingCustomTableError
    , fetchingCustomTableEnd
    , initialTitle
    , initialTagsIds
    , initialTagsLiveValues
    , inputCellStyle
    //, resetState
} = actions;