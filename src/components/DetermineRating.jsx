// utils.js
export const determineRating = (score) => {
  if (score < 75) {
    return 'failed';
  } else if (score < 85) {
    return 'passed';
  } else if (score < 95) {
    return 'excellent';
  } else {
    return 'outstanding';
  }
};
