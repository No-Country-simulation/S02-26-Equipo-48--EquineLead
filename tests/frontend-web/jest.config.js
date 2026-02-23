module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/health_check.test.js'],  // Only run health check test
    verbose: true,
    collectCoverage: false,
    coverageDirectory: 'coverage',
    testTimeout: 10000
};
