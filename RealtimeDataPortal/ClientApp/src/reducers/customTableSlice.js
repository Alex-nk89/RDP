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
        textAlign: 'start',
        verticalAlign: 'middle',
        colSpan: 1,
        rowSpan: 1,
        color: '#373A40',
        backgroundColor: '#fff'
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
            let countAddingCells = 0;

            state.tables[action.payload].rows[0].cells.forEach(cell => {
                countAddingCells = countAddingCells + JSON.parse(cell.cellStyle).colSpan;
            });

            const addingRow = {
                rowId: 0,
                customTableId: 0,
                cells: new Array(countAddingCells).fill(cell)
            };
            state.tables[action.payload].rows.push(addingRow);
        },
        deleteRow: (state, { payload: { indexTable, indexRow } }) => {
            state.tables[indexTable].rows.splice(indexRow, 1);
        },
        addRowSpan: (state, { payload: { indexTable, indexRow, indexCell, cellStyle } }) => {
            const removingRows = JSON.parse(state.tables[indexTable].rows[Number(indexRow)].cells[Number(indexCell)].cellStyle).rowSpan;
            const removingCells = JSON.parse(state.tables[indexTable].rows[Number(indexRow)].cells[indexCell].cellStyle).colSpan;
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle = cellStyle;
            state.tables[indexTable].rows[Number(indexRow) + removingRows].cells.splice(Number(indexCell), removingCells);
        },
        removeRowSpan: (state, { payload: { indexTable, indexRow, indexCell, cellStyle } }) => {
            const addingRows = JSON.parse(state.tables[indexTable].rows[Number(indexRow)].cells[Number(indexCell)].cellStyle).rowSpan - 1;
            const addingCells = JSON.parse(state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle).colSpan;
            state.tables[indexTable].rows[Number(indexRow) + addingRows].cells.splice(Number(indexCell), 0, ...new Array(addingCells).fill(cell));
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle = cellStyle;
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
        addColSpan: (state, { payload: { indexTable, indexRow, indexCell, cellStyle } }) => {
            const removingCells = JSON.parse(state.tables[indexTable].rows[indexRow].cells[Number(indexCell) + 1].cellStyle).colSpan;
            const removingRows = JSON.parse(state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle).rowSpan;
            state.tables[indexTable].rows[indexRow].cells[Number(indexCell) + 1] = state.tables[indexTable].rows[indexRow].cells[indexCell];

            for (let i = Number(indexRow); i < Number(indexRow) + removingRows; i++) {
                state.tables[indexTable].rows[i].cells.splice(Number(indexCell), removingCells);
            }
            
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle = cellStyle;
        },
        removeColSpan: (state, { payload: { indexTable, indexRow, indexCell, cellStyle } }) => {
            //const addingCells = JSON.parse(state.tables[indexTable].rows[indexRow].cells[Number(indexCell) + 1].cellStyle).colSpan;
            const addingRows = JSON.parse(state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle).rowSpan;
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellStyle = cellStyle;

            for (let i = Number(indexRow); i < Number(indexRow) + addingRows; i++) {
                const index = i === Number(indexRow) ? Number(indexCell) + 1 : Number(indexCell);
                state.tables[indexTable].rows[i].cells.splice(index, 0, cell);
            }
        },
        inputCellContain: (state, { payload: { indexTable, indexRow, indexCell, cellContain, typeCell } }) => {
            state.tables[indexTable].rows[indexRow].cells[indexCell].cellContain = cellContain;
            state.tables[indexTable].rows[indexRow].cells[indexCell].typeCell = typeCell;
        },
        inputCellStyle: (state, { payload: { indexTable, indexRow, indexCell, cellStyle } }) => {
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
        },
        resetState: (state) => {
            state.tables = [table];
        }
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
    , addColSpan
    , removeColSpan
    , addRowSpan
    , removeRowSpan
    , resetState
} = actions;