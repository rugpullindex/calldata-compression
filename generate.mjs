// @format
import ethcrypto from "eth-crypto";
import { appendFileSync, readFileSync } from "fs";
import random from "random-bigint";
import brotli from "brotli";

const total = 100000;

async function gen() {
  for (let b = 100; b < total; b *= 10) {
    const fileName = `balancedata${b}`;

    for (let i = 0; i < b; i++) {
      const { address } = ethcrypto.createIdentity();
      const num = random(256);
      appendFileSync(fileName, `${address}: ${num} \r\n`);
    }

    const fileBuf = readFileSync(fileName);
    console.info(`${b} balances NO COMPRESSION: ${fileBuf.length} B`);
    const comprBuf = brotli.compress(readFileSync(fileName));
    const change = ((fileBuf.length - comprBuf.length) / fileBuf.length) * -100;
    console.info(
      `${b} balances BROTLI: ${comprBuf.length} B (${change.toFixed(0)}%)`
    );
  }
}

(async () => {
  gen();
})();
