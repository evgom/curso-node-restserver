const path = require('path');
const { uuid } = require('uuidv4');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files === undefined ? reject('Debe enviar un archivo') : files ;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            console.log('extensiones no admitidas');
            
            return reject(`La extensión '${extension}' no es permitida. Extensiones validas: '${extensionesValidas}'`);

        }

        const nombreTemp = uuid() + "." + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            };

            resolve(nombreTemp);
        });
    });
};


module.exports = {
    subirArchivo
};