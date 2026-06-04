const { AccessToken } = require('livekit-server-sdk');

/**
 * Generate a LiveKit token for a participant in a specific room.
 * @param {string} roomName - Name of the LiveKit room (e.g., `session_${sessionId}`)
 * @param {string} participantIdentity - Unique ID of the participant (user.id)
 * @param {string} participantName - Display name (user.full_name)
 * @param {string} role - 'presenter', 'picker', 'contestant', or 'viewer'
 * @returns {Promise<string>} LiveKit access token
 */
async function getLiveKitToken(roomName, participantIdentity, participantName, role) {
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantIdentity,
    name: participantName,
    metadata: JSON.stringify({ role }),
  });

  // Grant permissions based on role
  const canPublish = role !== 'viewer';
  const canSubscribe = true;

  at.addGrant({ roomJoin: true, room: roomName, canPublish, canSubscribe });

  return await at.toJwt();
}

module.exports = { getLiveKitToken };
