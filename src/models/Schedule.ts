import {Model, Column, Table, CreatedAt, UpdatedAt, DataType} from "sequelize-typescript";

interface iAvailableSLots {
    timeSlots: string[]
}
@Table
export class Schedule extends Model<Schedule> {

    @Column(DataType.STRING)
    weekdays!: string;

    @Column(DataType.JSON)
    availableSlots!: iAvailableSLots;

    @Column(DataType.JSON)
    bookedSlots?: string[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

}
