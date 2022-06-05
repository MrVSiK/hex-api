import { EncryptPassword, VerifyPassword } from "../src/handlers/userHandlers";
import { assert } from "chai";

describe("Password encryption and decryption", () => {
    it("Encrypt a string", () => {
        const response = EncryptPassword("teststring@12345");
        assert.containsAllKeys(response, ["salt", "hash", "storageHash"]);
    })

    it("Verify a string and it's hash", () => {
        const response = EncryptPassword("teststring@12345");
        const isSame = VerifyPassword("teststring@12345", response.storageHash);
        assert.isTrue(isSame);
    })

    it("Reject a string and wrong hash", () => {
        const response = EncryptPassword("teststring@12345");
        const isSame = VerifyPassword("teststring", response.storageHash);
        assert.isFalse(isSame);
    })
});