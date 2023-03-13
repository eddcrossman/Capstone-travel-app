require('jest-fetch-mock').enableMocks();

import { checkMeaning } from "../src/client/js/meaningChecker";

describe("Testing the checkMeaning() function", () => {
    test("Response with a status.code value of 0 should run without any errors", async () => {
       const mockResponse = {
        status: {code: 0},
        agreement: 'DISAGREEMENT',
        confidence: 94,
        irony: 'NONIRONIC',
        model: 'general_en',
        score_tag: 'P',
        subjectivity: 'SUBJECTIVE'
    }

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    test = await checkMeaning();
    expect(fetch).toHaveBeenCalled();

    })
});