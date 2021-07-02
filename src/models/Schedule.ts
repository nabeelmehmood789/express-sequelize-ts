import {Model, Column, Table, CreatedAt, UpdatedAt, DataType} from "sequelize-typescript";

@Table
export class Schedule extends Model<Schedule> {

    @Column(DataType.STRING)
    weekdays!: string;

    @Column(DataType.JSON)
    availableSlots!: any;

    @Column(DataType.JSON)
    bookedSlots?: string[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

}
