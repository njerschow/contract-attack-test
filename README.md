# Solidity Test

NFT deployed to: 0xC09Ff9115C1CE86a3F1Bd501a625772fd299cd42
PwnNFT contract deployed to: 

## To use:
Hit the deposit function of the NFT contract with one wallet. You can then use the frontend to steal those funds from another wallet by exploiting via re-entrancy

Easiest way to trigger a deposit on the original contract is by uploading the ABI to https://eth95.dev/

You have to be on the AVAX Fuji network, though this works on any EVM chain. Further improvements include suggesting a chain switch to metamask if the wrong chain is detected.


## Contributing

### Pre Requisites

Before running any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an environment
variable. Follow the example in `.env.example`. If you don't already have a mnemonic, use this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

## Syntax Highlighting

If you use VSCode, you can enjoy syntax highlighting for your Solidity code via the [hardhat-vscode](https://github.com/NomicFoundation/hardhat-vscode) extension.

## Caveats

### Ethers and Waffle

If you can't get the [Waffle matchers](https://ethereum-waffle.readthedocs.io/en/latest/matchers.html) to work, try to
make your `ethers` package version match the version used by the `@ethereum-waffle/chai` package. Seem
[#111](https://github.com/paulrberg/solidity-template/issues/111) for more details.
