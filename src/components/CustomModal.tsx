import styles from "src/styles/CustomModal.module.css";

import Modal from "react-modal";
import Context from "src/context/Context";
import { useContext, useEffect, useState } from "react";
Modal.setAppElement("#__next");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    minWidth: "400px",
  },
};

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (wallet: string) => void;
}

export default function CustomModal({ isOpen, closeModal, onSubmit }: Props) {
  const [value, setValue] = useState("");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Undirskrifa"
    >
      <div className={styles.title}>
        <h2>Eitthvað info</h2>
        <button className={styles.button} onClick={closeModal}>
          close
        </button>
      </div>
      <div className={styles.content}>
        <label className={styles.label}>Claimer wallet:</label>
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className={styles.input}
        />
        <button className={styles.button} onClick={() => onSubmit(value)}>
          Undirritað
        </button>
      </div>
    </Modal>
  );
}
