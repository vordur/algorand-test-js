import algosdk from "algosdk";
import * as fs from "fs";
import * as path from "path";

const token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const server = "http://127.0.0.1";
const port = 4001;

export const algodClientDev = new algosdk.Algodv2(token, server, port);

export type UserAcc = algosdk.Account;

export function createTestAcc() {
  try {
    const acc = algosdk.generateAccount();
    console.log("Account Address = " + acc.addr);
    const mnemonic = algosdk.secretKeyToMnemonic(acc.sk);
    console.log("Add funds to account using the TestNet Dispenser: ");
    console.log("https://dispenser.testnet.aws.algodev.network/ ");
    return { acc, mnemonic };
  } catch (err) {
    console.log("err", err);
  }

  return {
    acc: {
      addr: "",
      sk: new Uint8Array(),
    },
    mnemonic: "",
  };
}

// Read file for Teal code
export async function readTeal(client: algosdk.Algodv2, fileName: string) {
  const filePath = path.join(__dirname, fileName);
  const data = fs.readFileSync(filePath);
  const results = await client.compile(data).do();
  return new Uint8Array(Buffer.from(results.result, "base64"));
}

// helper function to await transaction confirmation
// Function used to wait for a tx confirmation
const waitForConfirmation = async function (
  algodclient: algosdk.Algodv2,
  txId: string
) {
  const status = await algodclient.status().do();
  let lastRound = status["last-round"];
  while (true) {
    const pendingInfo = await algodclient
      .pendingTransactionInformation(txId)
      .do();
    if (
      pendingInfo["confirmed-round"] !== null &&
      pendingInfo["confirmed-round"] > 0
    ) {
      //Got the completed Transaction
      console.log(
        "Transaction " +
          txId +
          " confirmed in round " +
          pendingInfo["confirmed-round"]
      );
      break;
    }
    lastRound++;
    await algodclient.statusAfterBlock(lastRound).do();
  }
};

export async function createApp(
  client: algosdk.Algodv2,
  approval: Uint8Array,
  clear_state: Uint8Array,
  appCreator: UserAcc,
  appArgs: Uint8Array[]
) {
  const params = await client.getTransactionParams().do();
  const onComplete = algosdk.OnApplicationComplete.NoOpOC;
  // declare application state storage (immutable)
  const localInts = 1;
  const localBytes = 1;
  const globalInts = 1;
  const globalBytes = 2;

  const txn = algosdk.makeApplicationCreateTxn(
    appCreator.addr,
    params,
    onComplete,
    approval,
    clear_state,
    localInts,
    localBytes,
    globalInts,
    globalBytes,
    appArgs
  );

  // Signin transaction
  const signedTxn = txn.signTxn(appCreator.sk);
  const transactionId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", transactionId);
  // Submit the transaction
  await client.sendRawTransaction(signedTxn).do();
  // Wait for confirmation
  await waitForConfirmation(client, transactionId);
  // display results
  const transactionResponse = await client
    .pendingTransactionInformation(transactionId)
    .do();

  const appId = transactionResponse["application-index"];
  console.log("Created new app-id: ", appId);
  return appId;
}
