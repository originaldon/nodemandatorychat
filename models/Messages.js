const Model = require('objection').Model;

class Message extends Model {
    static get tableName() {
        return 'messages';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['message_text', 'user_id', 'room_id', 'timestamp'],

            properties: {
                id: {type: 'integer'},
                message_text: {type: 'string'},
                user_id: {type: 'integer'},
                room_id: {type: 'integer'},
                timestamp: {type: 'dateTime'}
            }       
        }
    }
}

module.exports = Message;
