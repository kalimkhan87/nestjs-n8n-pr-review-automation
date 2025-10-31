import { Injectable } from '@nestjs/common';
import { ShardingService } from '../database/sharding.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private shardingService: ShardingService) {}

  // Bad: No error handling, function doing too much
  async create(createUserDto: CreateUserDto) {
    const userId = Math.floor(Math.random() * 1000000); // Bad: Unreliable ID generation
    
    // Bad: SQL injection risk, no parameterized query
    const query = `
      INSERT INTO users (id, name, email, age) 
      VALUES (${userId}, '${createUserDto.name}', '${createUserDto.email}', ${createUserDto.age})
    `;
    
    await this.shardingService.executeOnShard(userId, query, []);
    
    return { id: userId, ...createUserDto };
  }

  // Bad: No pagination, could return huge dataset
  async findAll() {
    const allUsers = [];
    for (let i = 0; i < 2; i++) { // Bad: hardcoded shard count
      const users = await this.shardingService.executeOnShard(i, 'SELECT * FROM users', []);
      allUsers.push(...users);
    }
    return allUsers;
  }

  // Bad: No error handling
  async findOne(id: number) {
    const user = await this.shardingService.getShardForUser(id);
    return user;
  }

  // Bad: No validation if user exists
  async update(id: number, updateUserDto: any) { // Bad: using 'any' type
    const query = `UPDATE users SET name = '${updateUserDto.name}', email = '${updateUserDto.email}' WHERE id = ${id}`;
    await this.shardingService.executeOnShard(id, query, []);
    return { id, ...updateUserDto };
  }

  // Bad: No soft delete, no checks
  async remove(id: number) {
    await this.shardingService.executeOnShard(id, `DELETE FROM users WHERE id = ${id}`, []);
  }
}
