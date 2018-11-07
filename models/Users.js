const Model = require('objection').Model;

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'password'],

            properties: {
                id: {type: 'integer'},
                username: {type: 'string'},
                password: {type: 'string'}
            }       
        }
    }
}

module.exports = User;