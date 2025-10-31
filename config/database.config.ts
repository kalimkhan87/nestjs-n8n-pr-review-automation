export const databaseConfig = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password123', // Bad: Hardcoded password
  database: 'mydb',
  synchronize: true, // Bad: Should be false in production
};

// Bad: No type definitions
export const shardConfigs = [
  {
    id: 1,
    host: '192.168.1.100',
    port: 5432,
    username: 'admin',
    password: 'admin123',
    database: 'shard_1'
  },
  {
    id: 2,
    host: '192.168.1.101',
    port: 5432,
    username: 'admin',
    password: 'admin123',
    database: 'shard_2'
  }
];
