export const getXPForLevel = (level) => {
  return Math.floor(1000 * Math.pow(1.15, level - 1));
};

export const calculateLevel = (xp) => {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatNumber = (num) => {
  return num.toLocaleString();
};
