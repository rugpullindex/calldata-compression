# Compressing calldata with brotli (Ethereum Rollup)

Vitalik said that rollups are ["a whole host of fancy compression
tricks"](https://vitalik.ca/general/2021/01/05/rollup.html). To guarantee data
availability to users, rollup projects use [Ethereum's EIP2028 calldata cost of
only 16
gas](https://github.com/ethereum/go-ethereum/blob/bbb57fd64b70e3c843b5171d0a4719cf457374fc/params/protocol_params.go#L77)
to squeeze as much data as possible into a transaction.

So I thought, why not use an off-the-shelf data compression algorithm like
brotli to shrink the batched calldata size even more.


## Methodology

Two things should be important to consider. We want random and realistic data.
Hence, in `generate.mjs` I'm generating real Ethereum addresses and I'm, too,
generating real unsigned integers in the range of 2^256. These then get logged
into a file. The file is compressed and we measure its size in bytes (B).

## Running the benchmark

So far, I've only tested this with brotli. Here's what I've got:

```bash
node generate.mjs
100 balances NO COMPRESSION: 161226 B
100 balances BROTLI: 77139 B (-52%)
1000 balances NO COMPRESSION: 744209 B
1000 balances BROTLI: 355991 B (-52%)
10000 balances NO COMPRESSION: 3296195 B
10000 balances BROTLI: 1577692 B (-52%)
```

You can run this benchmark yourself by cloning this repository and running the
file with node. We can see that brotli achieves a compression rate of -52%,
meaning it can cut the size of calldata in half.

## Caveats

This benchmark assumes that we use calldata purely to keep L2 data available
on L1 by putting it into call data. However, there's a few things to consider:

- Rollups will likely not use uint256 but a smaller, more adjusted number
  format.
- Rollups may now use ed25519 derived addresses from public keys but an
  entirely different signature function (e.g. BLS).
- Rollups may require to make use off the call data, which may in turn not
  allow to compress it as decompression would be too costly for e.g. a smart
  contract.
