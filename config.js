const configs = function() {
  switch (process.env.NODE_ENV) {
    default:
      return {
        APP_URL: 'http://localhost:3000',
        API_URL: 'http://localhost:8000/api',
        API_IMAGE_URL: 'http://localhost:8282',
        MONGO_HOST: 'localhost',
        MONGO_PORT: '27017',
        MONGO_DB_NAME: 'post',
      };
  }
};

const settings = {
  ...configs(),
};

module.exports = settings;
