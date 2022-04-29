# hedera-sample
Sample project to interact with hedera


- Add 3 properties to your .env file
```json
HEDERA_PORTAL_ACCOUNT_ID=
HEDERA_PORTAL_PRIVATE_KEY=
HEDERA_NETWORK=testnet
```
for HEDERA_PORTAL_ACCOUNT_ID and HEDERA_PORTAL_PRIVATE_KEY, you can create account on hedera testnet portal https://docs.hedera.com/guides/testnet/testnet-access,

You can call this function for doing a mint function call on the contract
```shell
"mint-nft" : "node scripts/mint-nft.js"
```


appData.json, contains the data that this will use where this project is smart enough to create a account if the deploy section is empty
and also the contract address is updated when you deploy using deploy.js
```json
  "accounts": {
    "deploy": {
      "accountId": "0.0.34344242",
      "privateKey": "0x8bacb2c8c048558136c950cc69cb7e4690fac834dc509364a70efba155d1a586"
    }
  },
  "contracts": {
    "contractAddress": "0x00000000000000000000000000000000020c0ebc"
  }
```

To check your transactions in hedera you can go to dragon glass https://testnet.dragonglass.me/hedera
