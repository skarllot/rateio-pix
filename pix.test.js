import test from "node:test";
import assert from "node:assert/strict";
import "./pix.js";

const { generatePixPayload, normalizePixKey, utf8Length } = globalThis.Pix;

test("generates the known-valid Pix BR Code sample exactly", () => {
  assert.equal(generatePixPayload({
    key: "pix@fgodoy.me",
    description: "Microsoft e streamings",
    amount: 143.65,
    receiverName: "Fabricio Godoy",
    receiverCity: "Sao Paulo",
    txid: "daqr235818714644422"
  }), "00020126610014br.gov.bcb.pix0113pix@fgodoy.me0222Microsoft e streamings5204000053039865406143.655802BR5914Fabricio Godoy6009Sao Paulo62230519daqr2358187146444226304AECF");
});

test("normalizes Pix keys and counts UTF-8 bytes", () => {
  assert.equal(normalizePixKey("  EXAMPLE@Email.COM ", "email"), "example@email.com");
  assert.equal(normalizePixKey("(11) 99999-9999", "phone"), "+5511999999999");
  assert.equal(utf8Length("ação"), 6);
});
