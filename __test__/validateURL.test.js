import { validateURL } from "../src/client/js/formHandler";
describe("Testing the validateURL() function", () => {
    const input = [
        "https://www.udacity.com",
        "http://www.udacity.com",
        "udacity.com",
        "hello",            
    ];

    const output = [
        true,
        true,
        false,
        false, 
    ];    

    for (let i in input) {
        test("A valid URL should return true, any other input should return false", () => {
            expect(validateURL(input[i])).toEqual(output[i]);
        })
    }
});