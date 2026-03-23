module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\.spec\.ts$',
    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                tsconfig: {
                    sourceMap: true,
                    inlineSourceMap: true,
                    inlineSources: true,
                },
            },
        ],
    },
    collectCoverageFrom: [
        '**/*.{ts,js}',
        '!**/*.module.ts',
        '!**/*.dto.ts',
        '!**/*.entity.ts',
        '!**/*.schema.ts',
        '!main.ts',
    ],
    coverageProvider: 'v8',
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
    },
};
