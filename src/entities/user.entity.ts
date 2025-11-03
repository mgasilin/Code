import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Platoon } from './platoon.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'ldap_uid', nullable: true, unique: true })
  ldapUid!: string;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber!: string;

  @Column({ name: 'password_hash', nullable: true })
  password_hash!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ nullable: true })
  patronymic!: string;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ name: 'platoon_id', nullable: true })
  platoonId!: string;

  @ManyToOne(() => Platoon, platoon => platoon.users)
  @JoinColumn({ name: 'platoon_id' })
  platoon!: Platoon;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ 
    type: 'varchar',
    enum: ['student', 'teacher']
  })
  role!: 'student' | 'teacher';

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens!: RefreshToken[];

  async checkPassword(password: string): Promise<boolean> {
    if (!this.password_hash) return false;
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, this.password_hash);
  }

  async setPassword(password: string): Promise<void> {
    const bcrypt = require('bcryptjs');
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    this.password_hash = await bcrypt.hash(password, rounds);
  }
}