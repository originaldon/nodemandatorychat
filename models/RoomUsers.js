const Model = require('objection').Model;

class RoomUsers extends Model {
    static get tableName() {
        return 'room_users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['room_id', 'user_id'],

            properties: {
                id: {type: 'integer'},
                room_id: {type: 'integer'},
                user_id: {type: 'integer'}
            }       
        }
    }
}

module.exports = RoomUser;