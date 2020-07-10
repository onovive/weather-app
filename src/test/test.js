
const request = require('supertest');
const app = require('../server/index');
import '@babel/polyfill'
import { getCountryName, calculateDateDifference } from '../client/js/app'

describe('Test root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});

describe('Test path "/forecast"', () => {
    test('it should return 200', async () => {
        const body = {
            city: 'milano',
            leavingDate: '01-01-2021',
            returningDate: '02-02-2021'
        };
        const response = await request(app).post('/forecast').send(body);
        expect(response.statusCode).toBe(200);
    });
});

describe('Test path "/previous"', () => {
    test('It should return previous data', async () => {
        var body = {
            city: 'milano',
            leavingDate: '01-01-2021',
            returningDate: '02-02-2021'
        };
        await request(app).post('/forecast').send(body);

        body = {
            city: 'berlin',
            leavingDate: '01-01-2021',
            returningDate: '02-02-2021'
        };
        await request(app).post('/forecast').send(body);

        const response = await request(app).get('/previous');
        expect(response.statusCode).toBe(200);

        body = response.body;
        expect(body.city).toBe('milano');
        expect(body.leavingDate).toBe('01-01-2021');
        expect(body.returningDate).toBe('02-02-2021');
    });
});

describe('Test getCountryName', () => {
    test('it should be defined', () => {
        expect(getCountryName).toBeDefined();
    });
    test('it should succeed', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    geonames: [
                        {
                            "numPostalCodes": 18388,
                            "maxPostalCode": "98168",
                            "countryCode": "IT",
                            "minPostalCode": "00010",
                            "countryName": "Italy"
                        }]
                }
                ),
            })
        );
        var response = await getCountryName('IT');
        expect(response).toBe("Italy");

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    geonames: [
                        {
                            "numPostalCodes": 147,
                            "maxPostalCode": "902",
                            "countryCode": "IS",
                            "minPostalCode": "101",
                            "countryName": "Iceland"
                        }]
                }
                ),
            })
        );
        var response2 = await getCountryName('IS');
        expect(response2).toBe("Iceland");
    });
})

describe('Test calculateDateDifference', () => {
    test('it should succeed', () => {
        var date1 = new Date('01-01-2021');
        var date2 = new Date('01-02-2021');
        var result = calculateDateDifference(date1, date2);
        expect(result).toBe(1);
    });
});
