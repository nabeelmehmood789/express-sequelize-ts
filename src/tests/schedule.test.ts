// const db = require('../models/Schedule');
// const scheduleServices = require('../services/scheduleServices')
import supertest from "supertest"
// import {app} from '../../src/app';
describe("test the JWT authorization middleware", () => {
    // Set the db object to a variable which can be accessed throughout the whole test file
    // let thisDb: any = db

    // Before any tests run, clear the DB and run migrations with Sequelize sync()
    // beforeAll(async () => {
    //     await thisDb.sequelize.sync({ force: true })
    // })

    it("should return all data in database", async () => {

        // App is used with supertest to simulate server request
        const response =  supertest()
            .get("/schedule")
            .expect(200)

        expect(response.body).toMatchObject({
            status:"success",
            statusCode:200,
            message:"",
        })
    })

    // it("should fail when accessing an authed route with an invalid JWT", async () => {
    //     const invalidJwt = "OhMyToken"
    //
    //     const response = await supertest(app)
    //         .post("/v1/auth/protected")
    //         .expect(400)
    //         .set("authorization", `bearer ${invalidJwt}`)
    //
    //     expect(response.body).toMatchObject({
    //         success: false,
    //         message: "Invalid token.",
    //     })
    // })

    // After all tersts have finished, close the DB connection
    // afterAll(async () => {
    //     await thisDb.sequelize.close()
    // })
})