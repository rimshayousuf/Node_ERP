const execSync = require('child_process').execSync;

const createDb = () => {
  return new Promise((resolve, reject) => {
    try {
      execSync('sequelize db:create', { stdio: 'inherit' });
      resolve('OK');
    } catch (e) {
      reject(e);
    }
  });
};

const migrate = () => {
  return new Promise((resolve, reject) => {
    try {
      execSync('sequelize db:migrate', { stdio: 'inherit' });
      resolve('OK');
    } catch (e) {
      reject(e);
    }
  });
};
// migrate()
createDb().then(() => migrate());