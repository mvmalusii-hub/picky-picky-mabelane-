exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('full_name', 100).notNullable();
    table.string('phone', 20);
    table.string('role', 20).defaultTo('viewer');
    table.integer('wallet_balance').defaultTo(0);
    table.integer('stats_times_picked').defaultTo(0);
    table.integer('stats_dates_won').defaultTo(0);
    table.integer('stats_gas_thrown').defaultTo(0);
    table.integer('stats_fines_paid').defaultTo(0);
    table.timestamp('ban_expires').nullable();
    table.timestamps(true, true);
  });

  // Sessions
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.timestamp('scheduled_start').notNullable();
    table.timestamp('scheduled_end').notNullable();
    table.uuid('picker_id').references('id').inTable('users');
    table.uuid('presenter_id').references('id').inTable('users');
    table.string('status', 20).defaultTo('scheduled');
    table.uuid('winner_id').references('id').inTable('users');
    table.timestamps(true, true);
  });

  // Session contestants
  await knex.schema.createTable('session_contestants', (table) => {
    table.uuid('session_id').references('id').inTable('sessions').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users');
    table.boolean('eliminated').defaultTo(false);
    table.boolean('is_top3').defaultTo(false);
    table.boolean('winner').defaultTo(false);
    table.primary(['session_id', 'user_id']);
  });

  // Gas cards
  await knex.schema.createTable('gas_cards', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('session_id').references('id').inTable('sessions');
    table.uuid('thrower_id').references('id').inTable('users');
    table.uuid('target_id').references('id').inTable('users');
    table.integer('percentage').notNullable();
    table.boolean('was_disqualified').defaultTo(false);
    table.timestamps(true, true);
  });

  // Fines
  await knex.schema.createTable('fines', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users');
    table.integer('amount').notNullable();
    table.text('reason');
    table.boolean('paid').defaultTo(false);
    table.timestamps(true, true);
  });

  // Subscriptions (Stripe)
  await knex.schema.createTable('subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('stripe_subscription_id');
    table.string('plan_type');
    table.string('status').defaultTo('active');
    table.timestamp('expires_at');
    table.timestamps(true, true);
  });

  // Transactions (wallet)
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users');
    table.integer('amount').notNullable();
    table.string('type');
    table.uuid('reference_id');
    table.timestamps(true, true);
  });

  // Auditions
  await knex.schema.createTable('audition_submissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('full_name').notNullable();
    table.string('email').notNullable();
    table.string('phone');
    table.text('video1_url').notNullable();
    table.text('video2_url').notNullable();
    table.string('status').defaultTo('pending');
    table.text('admin_notes');
    table.timestamps(true, true);
  });

  // 🆕 Votes table (for viewer voting on various categories)
  await knex.schema.createTable('votes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('session_id').references('id').inTable('sessions');
    table.uuid('voter_id').references('id').inTable('users');
    table.uuid('target_id').references('id').inTable('users'); // contestant being voted for
    table.string('category', 50); // 'best_gas', 'fan_favorite', 'prediction', 'next_picker'
    table.integer('weight').defaultTo(1); // vote multiplier from shop items
    table.timestamps(true, true);
    table.unique(['session_id', 'voter_id', 'category', 'target_id']); // one vote per category per user per session
  });

  // 🆕 Purchases table (shop items bought by viewers)
  await knex.schema.createTable('purchases', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users');
    table.uuid('session_id').references('id').inTable('sessions');
    table.string('item_type', 50); // 'plea_boost', 'gas_shield', 'side_eye', 'mystery_gas', 'rose_rain', etc.
    table.uuid('target_contestant_id').references('id').inTable('users');
    table.integer('amount_paid');
    table.boolean('used').defaultTo(false);
    table.timestamp('used_at');
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('purchases');
  await knex.schema.dropTableIfExists('votes');
  await knex.schema.dropTableIfExists('audition_submissions');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('subscriptions');
  await knex.schema.dropTableIfExists('fines');
  await knex.schema.dropTableIfExists('gas_cards');
  await knex.schema.dropTableIfExists('session_contestants');
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('users');
};
