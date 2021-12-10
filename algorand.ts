import algosdk from "algosdk";

export const algodClientDev = new algosdk.Algodv2(
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "http://127.0.0.1",
  "4001"
);

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
}
