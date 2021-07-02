import * as express from 'express';
import * as bodyParser from 'body-parser';
import {schedule} from "./routes/Schedule";
import {Express} from "express";

export const app : Express = express();

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// middleware for json body parsing
app.use(bodyParser.json({limit: '5mb'}));


app.use('/schedule',schedule)
