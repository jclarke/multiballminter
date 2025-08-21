# Multiminter

A multi-chain minting application for deploying and interacting with smart contracts across multiple blockchain networks.

## Prerequisites

### macOS (with Homebrew)

1. Install Homebrew (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Node.js and npm:
   ```bash
   brew install node
   ```

3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Windows

#### Option 1: Using Windows Package Manager (winget)
1. Install Node.js:
   ```powershell
   winget install OpenJS.NodeJS
   ```

#### Option 2: Using Chocolatey
1. Install Chocolatey (if not already installed):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   ```

2. Install Node.js:
   ```powershell
   choco install nodejs
   ```

#### Option 3: Direct Download
1. Download Node.js installer from [https://nodejs.org](https://nodejs.org)
2. Run the installer and follow the installation wizard
3. Restart your terminal/command prompt after installation

### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd multiminter
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy `.env.sample` to `.env` and configure your environment variables
   ```bash
   cp .env.sample .env
   ```

4. Add your private key to the `.env` file
   - Open `.env` in your text editor
   - Replace `your_private_key_here` with your actual wallet private key
   - **Important**: Never commit your `.env` file to version control

## Usage

1. Ensure your `.env` file contains your private key
2. Run the minting application:
   ```bash
   npm run mint
   ```
   This will execute the ApeChain minting script (`mint_apechain.js`)

## Environment Variables

- `PRIVATE_KEY` - Your wallet private key for signing transactions
- See `.env.sample` for additional configuration options

## Security

- **Never share or commit your private key**
- Keep your `.env` file in `.gitignore`
- Use separate wallets for development and production

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.