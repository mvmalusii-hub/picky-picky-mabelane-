const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  // Delete existing entries (order matters due to foreign keys)
  await knex('purchases').del();
  await knex('votes').del();
  await knex('gas_cards').del();
  await knex('session_contestants').del();
  await knex('sessions').del();
  await knex('audition_submissions').del();
  await knex('subscriptions').del();
  await knex('transactions').del();
  await knex('fines').del();
  await knex('users').del();

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insert users (demo)
  const [admin] = await knex('users').insert({
    email: 'admin@pickypicky.com',
    password_hash: hashedPassword,
    full_name: 'Admin User',
    role: 'admin',
    wallet_balance: 1000,
  }).returning('id');

  const [presenter] = await knex('users').insert({
    email: 'presenter@pickypicky.com',
    password_hash: hashedPassword,
    full_name: 'Lebo Presenter',
    role: 'presenter',
    wallet_balance: 500,
  }).returning('id');

  const [picker] = await knex('users').insert({
    email: 'picker@pickypicky.com',
    password_hash: hashedPassword,
    full_name: 'Thabo Picker',
    role: 'picker',
    wallet_balance: 200,
  }).returning('id');

  const contestantIds = [];
  for (let i = 1; i <= 10; i++) {
    const [cid] = await knex('users').insert({
      email: `contestant${i}@example.com`,
      password_hash: hashedPassword,
      full_name: `Contestant ${i}`,
      role: 'picked',
      wallet_balance: 50,
    }).returning('id');
    contestantIds.push(cid);
  }

  // Insert a demo session (scheduled for tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 15, 0, 0);
  const endTime = new Date(tomorrow);
  endTime.setMinutes(endTime.getMinutes() + 15);

  const [session] = await knex('sessions').insert({
    scheduled_start: tomorrow,
    scheduled_end: endTime,
    picker_id: picker,
    presenter_id: presenter,
    status: 'scheduled',
  }).returning('id');

  // Add contestants to session
  for (const cid of contestantIds) {
    await knex('session_contestants').insert({
      session_id: session.id,
      user_id: cid,
      eliminated: false,
      is_top3: false,
    });
  }

  // Insert some sample shop purchases (optional)
  await knex('purchases').insert({
    user_id: admin,
    session_id: session.id,
    item_type: 'gas_shield',
    target_contestant_id: contestantIds[0],
    amount_paid: 25,
    used: false,
  });

  console.log('Seeding complete: admin, presenter, picker, 10 contestants, one session created.');
};
