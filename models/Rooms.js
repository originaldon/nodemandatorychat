const Model = require('objection').Model;

class Rooms extends Model {
    static get tableName() {
        return 'rooms';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['room_name'],

            properties: {
                id: {type: 'integer'},
                room_name: {type: 'string'}
            }       
        }
    }
}

module.exports = Room;