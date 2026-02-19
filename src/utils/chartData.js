/**
 * Chart data transformation utilities for game visualization
 */

/**
 * Transform game rounds into cumulative data for line chart
 * @param {Array} rounds - Array of round objects with scores
 * @param {Array} players - Array of player objects
 * @returns {Array} Array of chart data points
 */
export const transformRoundsToChartData = (rounds, players) => {
  if (!rounds || rounds.length === 0 || !players || players.length === 0) {
    return [];
  }

  // Initialize cumulative scores for each player
  const cumulativeScores = {};
  players.forEach(player => {
    cumulativeScores[player.id] = 0;
  });

  // Transform each round into a data point
  const chartData = rounds.map((round, index) => {
    const dataPoint = {
      round: index + 1,
      name: `Round ${index + 1}`
    };

    // Update cumulative scores and add to data point
    players.forEach(player => {
      if (round.scores && round.scores[player.id] !== undefined) {
        cumulativeScores[player.id] += round.scores[player.id];
      }
      dataPoint[player.id] = cumulativeScores[player.id];
    });

    return dataPoint;
  });

  return chartData;
};

/**
 * Get distinct colors for chart lines
 * @param {number} index - Color index
 * @returns {string} Color hex code
 */
export const getPlayerColor = (index) => {
  const colors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
  ];
  
  return colors[index % colors.length];
};

/**
 * Get player name by ID
 * @param {string} playerId - Player ID
 * @param {Array} players - Array of player objects
 * @returns {string} Player name or fallback
 */
export const getPlayerName = (playerId, players) => {
  const player = players.find(p => p.id === playerId);
  return player ? player.name : `Player ${playerId}`;
};

/**
 * Prepare chart data with player information
 * @param {Array} rounds - Game rounds
 * @param {Array} players - Player data
 * @returns {Object} Chart data and player configurations
 */
export const prepareChartData = (rounds, players) => {
  const chartData = transformRoundsToChartData(rounds, players);
  
  const playerConfigs = players.map((player, index) => ({
    id: player.id,
    name: player.name,
    color: getPlayerColor(index),
    dataKey: player.id
  }));

  return {
    data: chartData,
    players: playerConfigs
  };
};
