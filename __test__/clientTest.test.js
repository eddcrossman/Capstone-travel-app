require('jest-fetch-mock').enableMocks();

import { getData } from "../src/client/js/app";

describe("Testing the getData() function", () => {
    test("Response with a ok value of true should run without any errors", async () => {
       const mockResponse = {
        body: {},
        bodyUsed: true,
        headers: {},
        ok: true,
        redirected: false,
        status: 200,
        statusText: "OK",
        type: "cors",
        url: "http://localhost:1982/getLatLong/newcastle"
    }

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    test = await getData('http://localhost:1982/getWeather');
    expect(fetch).toHaveBeenCalled();
    
    })
});