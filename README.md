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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
