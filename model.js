const threadMap = [];
function getOpenaiThreadId(discordThreadId) {
    for (const mapping of threadMap) {
        if (mapping.discordThreadId === discordThreadId) {
            return mapping.openaiThreadId;
        }
    }
    return null; // or any other appropriate value indicating 'not found'
}

function addThreadToMap(discordThreadId, openaiThreadId) {
    // Optional: Add validation for discordThreadId and openaiThreadId
    threadMap.push({ discordThreadId, openaiThreadId });
}

module.exports = { getOpenaiThreadId, addThreadToMap };