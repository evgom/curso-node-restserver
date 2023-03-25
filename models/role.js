const { Schema, model } = require('mongoose');

const RolesSchema = Schema({
    rol:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

module.exports = model('Role', RolesSchema);