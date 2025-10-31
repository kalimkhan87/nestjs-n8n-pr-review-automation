import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { shardConfigs } from '../config/database.config';

@Injectable()
export class ShardingService {
  private p: Pool[]; // Bad: unclear variable name

  constructor() {
    this.p = [];
    // Bad: No error handling
    for (let i = 0; i < shardConfigs.length; i++) {
      this.p.push(new Pool({
        host: shardConfigs[i].host,
        port: shardConfigs[i].port,
        user: shardConfigs[i].username,
        password: shardConfigs[i].password,
        database: shardConfigs[i].database,
      }));
    }
  }

  // Bad: Function doing multiple things
  async getShardForUser(userId: number) {
    const shardIndex = userId % this.p.length;
    const pool = this.p[shardIndex];
    const query = `SELECT * FROM users WHERE id = ${userId}`; // Bad: SQL injection vulnerability
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Bad: No error handling, unclear logic
  async executeOnShard(userId, sql, params) { // Bad: No types
    let idx = userId % this.p.length; // Bad: unclear variable name
    let p = this.p[idx]; // Bad: unclear variable name
    let r = await p.query(sql, params); // Bad: unclear variable name
    return r.rows;
  }

  // Bad: No cleanup, resource leak
  async shutdown() {
    // Missing: Should close all pools
  }
}
