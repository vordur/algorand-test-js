import { useCallback, useContext, useEffect, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";

import {
  algodClientDev,
  createApp,
  createTestAcc,
  readTeal,
  UserAcc,
} from "../../algorand";
import Context from "../context/Context";
import { ActionType } from "../context/reducer";
import CustomModal from "src/components/CustomModal";

import styles from "../styles/Home.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const approval = await readTeal(
    algodClientDev,
    "../../../public/approval.teal"
  );

  const clear_state = await readTeal(
    algodClientDev,
    "../../../public/clear_state.teal"
  );

  const approval_arr = Array.from(approval);
  const clear_state_arr = Array.from(clear_state);

  return {
    props: { approval_arr, clear_state_arr },
  };
};

type Props = {
  approval_arr: number[];
  clear_state_arr: number[];
};

export default function Home({ approval_arr, clear_state_arr }: Props) {
  const context = useContext(Context);

  const [addressSender, setAddressSender] = useState("");
  const [accInfo, setAccInfo] = useState<Record<string, any>>();
  const [wallet, setWallet] = useState<UserAcc>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAccInfo = useCallback(async (address: string) => {
    try {
      const accountInfo = await algodClientDev.accountInformation(address).do();

      accInfo &&
        context.dispatch?.({
          type: ActionType.SET_INSURERACC,
          payload: {
            ...context.state,
            creatorInfo: accountInfo,
          },
        });

      setAccInfo(accountInfo);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateApp = useCallback(
    async (claimerWallet: string) => {
      setIsModalOpen(false);
      const appArgs = [new Uint8Array(Buffer.from(claimerWallet))];
      try {
        const apiId = await createApp(
          algodClientDev,
          new Uint8Array(approval_arr),
          new Uint8Array(clear_state_arr),
          wallet!,
          appArgs
        );
        console.log(apiId);
        getAccInfo(addressSender);
      } catch (e) {
        console.error(e);
      }
    },
    [addressSender, approval_arr, clear_state_arr, getAccInfo, wallet]
  );

  const onGetCreatorWallet = useCallback(() => {
    if (window) {
      let address;
      const data = localStorage.getItem("insurer-wallet");
      if (!data) {
        const user = createTestAcc();
        setWallet(user.acc);
        address = user!.acc.addr;
        const sk = Array.from(user!.acc.sk) as unknown as Uint8Array;

        context.dispatch?.({
          type: ActionType.SET_INSURERACC,
          payload: {
            ...context.state,
            insurerAcc: {
              acc: {
                ...user!.acc,
                sk,
              },
              mnemonic: user!.mnemonic,
            },
          },
        });
      } else {
        const key = JSON.parse(data);
        address = key.acc.addr;
        context.dispatch?.({
          type: ActionType.SET_INSURERACC,
          payload: {
            ...context.state,
            insurerAcc: {
              ...key,
            },
          },
        });

        setWallet({
          addr: address,
          sk: new Uint8Array(key.acc.sk),
        });
      }
      setAddressSender(address);
      address && getAccInfo(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onGetCreatorWallet();
  }, [onGetCreatorWallet]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Basic demo</title>
        <meta name="description" content="Generated by ég" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2> Hæ hæ , smá algorand demo</h2>
        <p className={styles.walletInfo}>
          <strong>Insurer wallet: </strong>
          <i
            onClick={() => {
              navigator.clipboard.writeText(addressSender);
            }}
          >
            {addressSender}
          </i>
        </p>
        <p className={styles.walletInfo}>
          <strong>Amount: </strong>
          <i>{accInfo?.amount} unit</i>
        </p>
        {accInfo?.amount === 0 ? (
          <p>
            Þarf að fara{" "}
            <a href="https://dispenser.testnet.aws.algodev.network/">hér</a> til
            að setja inn í fund.
          </p>
        ) : (
          <button
            className={styles.button}
            onClick={() => setIsModalOpen(true)}
          >
            Stofna smart contract app
          </button>
        )}
      </main>
      <CustomModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSubmit={onCreateApp}
      />
    </div>
  );
}
