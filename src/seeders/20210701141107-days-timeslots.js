'use strict';
const WEEK_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_FORMAT = `{"timeSlots":[
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM"
]}`
const CREATED_AT  = new Date();
const UPDATED_AT  = new Date();
const BOOKED_SLOTS  = null;
const schedules = [];
WEEK_DAYS.forEach((weekDay)=>{
    schedules.push({
        weekdays:weekDay,
        availableSlots:`${TIME_FORMAT}`,
        bookedSlots:BOOKED_SLOTS,
        createdAt:CREATED_AT,
        updatedAt:UPDATED_AT
    })
});
module.exports = {
  up: (queryInterface, Sequelize) =>  queryInterface.bulkInsert('Schedules', schedules),

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Schedules', null, {});
  }
};
