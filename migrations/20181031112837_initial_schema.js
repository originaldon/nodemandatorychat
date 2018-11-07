exports.up = function(knex, Promise) {
    return knex.schema
	.createTable('messages', function(table) {
        table.increments('id').primary();
        table.string('message_text');
        table.integer('user_id');
        table.integer('room_id');
        table.dateTime('timestamp');
	}).createTable('room_users', function(table) {
        table.increments('id').primary();
        table.integer('room_id');
        table.integer('user_id');
	}).createTable('users', function(table) {
        table.increments('id').primary();
        table.string('username');
        table.string('password');
    }).createTable('rooms', function(table) {
        table.increments('id').primary();
        table.string('room_name');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('room_users')
    .dropTableIfExists('users')
    .dropTableIfExists('rooms');
};
