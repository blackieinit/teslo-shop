import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text'
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'boolean'
    })
    isActive: boolean;

    @Column({
        type: 'text',
        default: [],
        array: true
    })
    roles: string[];
    
    @BeforeInsert()
    async createUser() {
        this.isActive = false;
        this.password = await bcrypt.hash(this.password, 10);
    }

}
