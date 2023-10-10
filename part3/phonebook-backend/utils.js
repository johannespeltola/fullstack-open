const getRandomInt = (min, max) => {
  return parseInt(Math.random() * (max - min) + min);
}

module.exports = { getRandomInt }
