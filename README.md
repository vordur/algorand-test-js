## Getting Started

First, make sure you have python 3.x.x, docker and sandbox
Set up venv (one time):
 * `python3 -m venv venv`

Active venv:
 * `. venv/bin/activate` (if your shell is bash/zsh)
 * `. venv/bin/activate.fish` (if your shell is fish)

Install dependencies:
* `pip install -r requirements.txt`

```bash
./sandbox up testnet
python3 contract.py
python3 contract.py
```

If you have sandbox on that is not testnet, clean it and restart it:
```bash
./sandbox down
./sandbox clean
./sandbox up testnet
```

Compile the contract to .teal:
 * `python3 contract.py`

Then run the frontend:
```bash
yarn install
yarn run dev
```

# Remember to have your logs open on your browser to see what's going on all the time

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Here you should follow the given link to fund the address and then create the smart contract with the claimer's address. 

To check transactions and what's going on with the address on the Testnet network, go to [https://testnet.algoexplorer.io](https://testnet.algoexplorer.io)

To get claimer address and also announce
 - Open a new tab
 - Go to [http://localhost:3000/claimer](http://localhost:3000/claimer)

To confirm the claimer's data 
  - Open a new tab
  - Go to [http://localhost:3000/doctor](http://localhost:3000/doctor)

Since this is just a demo, states are store locally. Remember to refresh the pages and clean the storage if needed, else this will be very buggy.

It's anyway , quite buggy 😅
