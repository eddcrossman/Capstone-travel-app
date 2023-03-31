require('jest-fetch-mock').enableMocks();
const server = require('../src/server/server');

describe("Testing the getLatLong() function", () => {
    test("Response with a status value of 200 should run without any errors", async () => {
        const mockResponse = {
            url: 'https://api.geoapify.com/v1/geocode/search?text=manchester&type=city&format=json&apiKey=XXX',
            status: 200,
            statusText: 'OK',
            headers: {},
            counter: 0
        }

        fetch.mockResponseOnce(JSON.stringify(mockResponse));

        const req = {
            params: { city: 'Manchester' }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };

        await server.getLatLong(req, res);
        expect(fetch).toHaveBeenCalled();
    })
});