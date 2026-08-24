const fs = require('fs');
const rawCsv = fs.readFileSync('test.tsv', 'utf8');
const delimiter = rawCsv.indexOf('\t') !== -1 ? '\t' : ',';
const lines = rawCsv.split(/\r?\n/).filter(line => line.trim() !== '');
const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
const data = [];
for (let i = 1; i < lines.length; i++) {
    let row = lines[i].split(delimiter);
    if (row.length === 1 && row[0] === '') continue;
    const rowData = {};
    headers.forEach((header, index) => {
        let val = row[index] ? row[index].trim() : '';
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1).replace(/""/g, '"');
        }
        rowData[header] = val;
    });
    data.push(rowData);
}

const getVal = (rowObj, keys) => {
    for (let k of keys) {
        const foundKey = Object.keys(rowObj).find(r => r.includes(k));
        if (foundKey) return rowObj[foundKey];
    }
    return '';
};

data.forEach((rowObj, index) => {
    if (rowObj['tên lớp'] && rowObj['tên lớp'].includes('Quản lý')) {
        console.log('Row ' + (index+2));
        console.log('Tên lớp: ', rowObj['tên lớp']);
        console.log('Phụ trách:', getVal(rowObj, ['phụ trách', 'phu trach', 'trainer']));
        console.log('Từ ngày:', getVal(rowObj, ['từ ngày', 'tu ngay', 'start']));
    }
});
