/**
 * Statistics calculation utilities for player performance metrics
 */

/**
 * Calculate win rate percentage
 * @param {number} wins - Number of wins
 * @param {number} matchesPlayed - Total matches played
 * @returns {number} Win rate as percentage (0-100)
 */
export const calculateWinRate = (wins, matchesPlayed) => {
  if (matchesPlayed === 0) return 0;
  return (wins / matchesPlayed) * 100;
};

/**
 * Calculate average score per match
 * @param {number} totalPoints - Total points accumulated
 * @param {number} matchesPlayed - Total matches played
 * @returns {number} Average score with 1 decimal place
 */
export const calculateAverageScore = (totalPoints, matchesPlayed) => {
  if (matchesPlayed === 0) return 0;
  return Math.round((totalPoints / matchesPlayed) * 10) / 10;
};

/**
 * Format win rate for display
 * @param {number} wins - Number of wins
 * @param {number} matchesPlayed - Total matches played
 * @returns {string} Formatted win rate as percentage
 */
export const formatWinRate = (wins, matchesPlayed) => {
  const winRate = calculateWinRate(wins, matchesPlayed);
  return `${winRate.toFixed(1)}%`;
};

/**
 * Format average score for display
 * @param {number} totalPoints - Total points accumulated
 * @param {number} matchesPlayed - Total matches played
 * @returns {string} Formatted average score
 */
export const formatAverageScore = (totalPoints, matchesPlayed) => {
  const avgScore = calculateAverageScore(totalPoints, matchesPlayed);
  return avgScore.toString();
};

/**
 * Format best game score for display
 * @param {number|null} bestGameScore - Best game score (lowest is best)
 * @returns {string} Formatted best game score
 */
export const formatBestGameScore = (bestGameScore) => {
  if (bestGameScore === null || bestGameScore === undefined) return "N/A";
  return bestGameScore.toString();
};

/**
 * Get performance level based on win rate
 * @param {number} winRate - Win rate percentage
 * @returns {object} Performance level with label and color
 */
export const getPerformanceLevel = (winRate) => {
  if (winRate >= 70) {
    return { label: "Expert", color: "text-purple-600 dark:text-purple-400" };
  } else if (winRate >= 50) {
    return { label: "Advanced", color: "text-blue-600 dark:text-blue-400" };
  } else if (winRate >= 30) {
    return {
      label: "Intermediate",
      color: "text-green-600 dark:text-green-400",
    };
  } else {
    return { label: "Beginner", color: "text-gray-600 dark:text-gray-400" };
  }
};

/**
 * Calculate comprehensive player statistics
 * @param {object} playerStats - Player stats object
 * @returns {object} Enhanced statistics with calculated metrics
 */
export const calculateEnhancedStats = (playerStats) => {
  const { wins, matchesPlayed, totalPoints, bestGameScore } = playerStats;

  const winRate = calculateWinRate(wins, matchesPlayed);
  const averageScore = calculateAverageScore(totalPoints, matchesPlayed);
  const performanceLevel = getPerformanceLevel(winRate);

  return {
    ...playerStats,
    winRate,
    averageScore,
    performanceLevel,
    formattedWinRate: formatWinRate(wins, matchesPlayed),
    formattedAverageScore: formatAverageScore(totalPoints, matchesPlayed),
    formattedBestGameScore: formatBestGameScore(bestGameScore),
  };
};
