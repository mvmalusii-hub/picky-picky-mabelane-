const { AccessToken } = require('livekit-server-sdk');

/**
 * Generate a LiveKit access token for a participant.
 * @param {string} roomName - LiveKit room name (e.g., session_uuid)
 * @param {string} identity - User ID
 * @param {string} name - Display name
 * @param {string} role - 'presenter', 'picker', 'contestant', 'viewer'
 * @returns {Promise<string>}
 */
async function generateLiveKitToken(roomName, identity, name, role) {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity,
    name,
    metadata: JSON.stringify({ role }),
  });

  const canPublish = role !== 'viewer';
  const canSubscribe = true;

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish,
    canSubscribe,
  });

  return await at.toJwt();
}

/**
 * Determine participant role based on session and user data.
 * @param {object} session - Session object
 * @param {object} user - User object
 * @returns {string}
 */
function determineRole(session, user) {
  if (user.role === 'presenter' && session.presenter_id === user.id) return 'presenter';
  if (session.picker_id === user.id) return 'picker';
  const isContestant = session.contestants?.includes(user.id) || false;
  if (isContestant) return 'contestant';
  return 'viewer';
}

module.exports = { generateLiveKitToken, determineRole };
