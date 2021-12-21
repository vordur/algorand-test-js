import { useEffect, useState } from "react";
import Head from "next/head";
import { algodClientDev, callApp, decodedAddr, encodedNumber } from "algorand";

import styles from "../styles/Home.module.css";

export default function Index() {
  const [addressClaimer, setAddressClaimer] = useState("");
  const [status, setStatus] = useState("");
  const [claim, setClaim] = useState({ status: "", type: "", days: 0 });

  useEffect(() => {
    if (window) {
      const wallet = localStorage.getItem("claimer-wallet");
      const data = localStorage.getItem("claimer_request");
      if (data && wallet) {
        const parsed_data = JSON.parse(data);
        const parsed_wallet = JSON.parse(wallet);
        setAddressClaimer(parsed_wallet.acc.addr);
        setClaim(parsed_data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirm = async (value: number) => {
    const appID = localStorage.getItem("app_id");
    const data = localStorage.getItem("insurer-wallet");
    const appArgs = [
      new Uint8Array(Buffer.from(claim.type)),
      decodedAddr(addressClaimer).publicKey,
      encodedNumber(value),
    ];

    claim.type === "care" && appArgs.push(encodedNumber(claim.days));

    if (data) {
      const insurer = JSON.parse(data);

      try {
        appID &&
          (await callApp(
            +appID,
            algodClientDev,
            {
              addr: insurer.acc.addr,
              sk: new Uint8Array(insurer.acc.sk),
            },
            appArgs,
            addressClaimer
          ));
        setStatus("Done! Check claimer's account :)");
        setClaim({ ...claim, status: "done" });
      } catch (e) {
        setStatus("Assert failed: Doctor says no :D");
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Basic demo</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Confirmation</h1>

        <p className={styles.walletInfo}>
          <strong>Claimer wallet: </strong>
          <i
            onClick={() => {
              navigator.clipboard.writeText(addressClaimer);
            }}
          >
            {addressClaimer}
          </i>
        </p>

        <p className={styles.walletInfo}>
          <strong>Claim type: </strong>
          <i
            onClick={() => {
              navigator.clipboard.writeText(addressClaimer);
            }}
          >
            {claim.type}
          </i>
        </p>

        <p className={styles.walletInfo}>
          <strong>Claim status: </strong>
          <i
            onClick={() => {
              navigator.clipboard.writeText(addressClaimer);
            }}
          >
            {claim.status}
          </i>
        </p>

        <button
          disabled={claim.status !== "open"}
          className={styles.button}
          onClick={() => onConfirm(1)}
        >
          Já
        </button>

        <button
          disabled={claim.status !== "open"}
          className={styles.button}
          onClick={() => onConfirm(2)}
        >
          Nei
        </button>

        <p>{status}</p>
      </main>
    </div>
  );
}
