/**
 * Calculates rating statistics from raw ratingStars data
 * @param {Object} product - The product object containing ratingStars
 * @returns {Object} { rating, reviewCount, distribution }
 */
export const getRatingStats = (product) => {
  const ratingStars = (product && product.ratingStars) || {};
  
  // Map string keys to numeric stars
  const starMap = {
    five_stars: 5,
    four_stars: 4,
    three_stars: 3,
    two_stars: 2,
    one_star: 1
  };

  let totalVotes = 0;
  let totalScore = 0;
  
  const distribution = [5, 4, 3, 2, 1].map(star => {
    // Try both numeric keys and string keys
    const count = Number(ratingStars[star]) || 
                  Number(ratingStars[Object.keys(starMap).find(k => starMap[k] === star)]) || 
                  0;
    
    totalVotes += count;
    totalScore += count * star;
    
    return {
      star,
      count
    };
  });

  const rating = totalVotes > 0 ? Number((totalScore / totalVotes).toFixed(1)) : 0;

  // Add percentage to distribution
  const distributionWithPercentage = distribution.map(d => ({
    ...d,
    percentage: totalVotes > 0 ? (d.count / totalVotes) * 100 : 0
  }));

  return {
    rating,
    reviewCount: totalVotes,
    distribution: distributionWithPercentage,
    totalStarVotes: totalVotes // For compatibility
  };
};
