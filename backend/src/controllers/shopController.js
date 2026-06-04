const db = require('../config/database');
const { deductWallet } = require('../services/walletService');

const SHOP_ITEMS = {
  plea_boost: { name: 'Plea Boost', price: 15, effect: 'extend_time' },
  gas_shield: { name: 'Gas Shield', price: 25, effect: 'block_gas' },
  side_eye: { name: 'Side-Eye', price: 12, effect: 'add_doubt' },
  clap_back: { name: 'Clap Back', price: 10, effect: 'remove_doubt' },
  mystery_gas: { name: 'Mystery Gas', price: 7, effect: 'random_gas' },
  rose_rain: { name: 'Rose Rain', price: 20, effect: 'emoji_rain' },
  insider_tip: { name: 'Insider Tip', price: 20, effect: 'reveal_lean' },
  super_vote: { name: 'Super Vote', price: 10, effect: 'vote_multiplier' },
};

exports.getShopItems = (req, res) => {
  res.json(SHOP_ITEMS);
};

exports.buyItem = async (req, res, next) => {
  try {
    const { itemType, sessionId, targetContestantId } = req.body;
    const userId = req.user.id;

    const item = SHOP_ITEMS[itemType];
    if (!item) return res.status(400).json({ error: 'Invalid item' });

    const session = await db('sessions').where({ id: sessionId, status: 'live' }).first();
    if (!session) return res.status(400).json({ error: 'Session not live' });

    const newBalance = await deductWallet(userId, item.price, 'shop_purchase', sessionId);
    if (newBalance === null) return res.status(402).json({ error: 'Insufficient funds' });

    const [purchase] = await db('purchases').insert({
      user_id: userId,
      session_id: sessionId,
      item_type: itemType,
      target_contestant_id: targetContestantId,
      amount_paid: item.price,
      used: false,
    }).returning('*');

    // Immediate effect for some items (e.g., rose_rain)
    if (itemType === 'rose_rain') {
      await db('purchases').where({ id: purchase.id }).update({ used: true, used_at: new Date() });
    }

    res.json({ success: true, newBalance, purchase });
  } catch (err) {
    next(err);
  }
};

exports.useItem = async (req, res, next) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.user.id;

    const purchase = await db('purchases').where({ id: purchaseId, user_id: userId, used: false }).first();
    if (!purchase) return res.status(404).json({ error: 'Purchase not found or already used' });

    const { item_type, session_id, target_contestant_id } = purchase;

    // Apply effect
    if (item_type === 'side_eye') {
      await db('session_contestants')
        .where({ session_id, user_id: target_contestant_id })
        .increment('doubt_count', 1);
    } else if (item_type === 'clap_back') {
      await db('session_contestants')
        .where({ session_id, user_id: target_contestant_id })
        .decrement('doubt_count', 1);
    } else if (item_type === 'gas_shield') {
      await db('session_contestants')
        .where({ session_id, user_id: target_contestant_id })
        .update({ has_shield: true });
    }

    await db('purchases').where({ id: purchaseId }).update({ used: true, used_at: new Date() });
    res.json({ success: true, message: `Item ${item_type} used` });
  } catch (err) {
    next(err);
  }
};
