import { Tooltip, ActionIcon, IoShareSocial } from '../Index';
///import TableToExcel from "../../../../../../node_modules/@linways/table-to-excel";

const SaveToExcel = () => {
    //const save = () => {
    //    TableToExcel.convert(document.querySelector("#table-rt"));
    //}

    const save = () => {
        const uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
        const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-' +
            'com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]> <xml><x:ExcelWorkbook>' +
            '<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
            '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>' +
            '<body><table>{table}</table></body></html>';
        const base64 = (s) => { return window.btoa(unescape(encodeURIComponent(s))) };
        const format = (s, c) => {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }

        const tableExcel = document.querySelector("#table-rt").innerHTML;
        const ctx = {
            // eslint-disable-next-line no-restricted-globals
            worksheet: name || '', table: tableExcel
        };

        const link = document.createElement("a");
        link.download = "export.xls";
        link.href = uri + base64(format(template, ctx))
        link.click();
    }

    return (
        <Tooltip label='Открыть в Excel'>
            <ActionIcon onClick={save}>
                <IoShareSocial size={18} />
            </ActionIcon>
        </Tooltip>
    );
}

export default SaveToExcel;