import { useContext, useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { createTestAcc } from "algorand";

import Context from "src/context/Context";

import styles from "../styles/Home.module.css";
import { ActionType } from "src/context/reducer";

export default function Index() {
  const context = useContext(Context);

  const [addressClaimer, setAddressClaimer] = useState("");
  const [status, setStatus] = useState("");
  const [claim, setClaim] = useState("health");
  const [days, setDays] = useState(5);

  const createAccount = async () => {
    const user = createTestAcc();
    setAddressClaimer(user.acc.addr);
    const sk = Array.from(user!.acc.sk) as unknown as Uint8Array;

    context.dispatch?.({
      type: ActionType.SET_CLAIMER_WALLET,
      payload: {
        ...context.state,
        claimerAcc: {
          acc: {
            ...user!.acc,
            sk,
          },
          mnemonic: user!.mnemonic,
        },
      },
    });
  };

  const showOptionDays = useMemo(() => claim !== "health", [claim]);

  useEffect(() => {
    if (window) {
      const data = localStorage.getItem("claimer-wallet");
      if (data) {
        const parsed = JSON.parse(data);
        setAddressClaimer(parsed.acc.addr);

        context.dispatch?.({
          type: ActionType.SET_CLAIMER_WALLET,
          payload: {
            ...context.state,
            claimerAcc: {
              ...parsed,
            },
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const claiming = async () => {
    const data = {
      status: "open",
      type: claim,
      days: claim === "health" ? 0 : days,
    };

    localStorage.setItem("claimer_request", JSON.stringify(data));
    setStatus(
      "Your doctor needs to confirm the documents/data you've been requested"
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Basic demo</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Tilkynna tjón</h1>
        <button className={styles.button} onClick={createAccount}>
          Create test wallet for claimer
        </button>

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
        <select
          className={styles.select}
          onChange={(e) => setClaim(e.target.value)}
        >
          <option value="health">Health</option>
          <option value="care">Care</option>
        </select>

        {showOptionDays && (
          <select
            className={styles.select}
            onChange={(e) => setDays(+e.target.value)}
          >
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="10">10</option>
          </select>
        )}

        <button className={styles.button} onClick={claiming}>
          Tilkynna
        </button>

        <p>{status}</p>
        <p>
          Fara
          <a href={`https://testnet.algoexplorer.io/address/${addressClaimer}`}>
            {" "}
            hér{" "}
          </a>
          til að skoða balance hjá claimer
        </p>
      </main>
    </div>
  );
}
