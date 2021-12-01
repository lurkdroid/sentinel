



export function write_solidroid_address(_addresses: any, file: string) {
    const fs = require('fs');
    let data = JSON.stringify(_addresses, null, 2);
    console.log(data);

    fs.writeFile(file, data, (err: any) => {
        if (err) throw err;
    });
}
