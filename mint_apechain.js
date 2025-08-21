const { ethers } = require('ethers');
const readline = require('readline');
require('dotenv').config();

// Contract details
const CONTRACT_ADDRESS = '0x075893707e168162234b62a5b39650e124ff3321';
const APECHAIN_RPC = 'https://apechain.calderachain.xyz/http'; // ApeChain RPC endpoint

// Extended ABI with all required functions
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "allowlist",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "dailyLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "mintedToday",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Utility function to prompt user
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function checkMintStatus() {
    try {
        // Check for private key
        if (!process.env.PRIVATE_KEY) {
            console.error('Please set PRIVATE_KEY in your .env file');
            process.exit(1);
        }

        // Connect to ApeChain
        const provider = new ethers.JsonRpcProvider(APECHAIN_RPC);
        
        // Create wallet instance
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log('\n🔍 Checking mint status for wallet:', wallet.address);
        console.log('━'.repeat(60));

        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        console.log('💰 Wallet balance:', ethers.formatEther(balance), 'APE');

        // Create contract instance
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // Check if wallet is on allowlist
        console.log('\n📋 Checking allowlist status...');
        const isAllowlisted = await contract.allowlist(wallet.address);
        console.log('Allowlist status:', isAllowlisted ? '✅ ALLOWED' : '❌ NOT ALLOWED');

        if (!isAllowlisted) {
            console.log('\n⚠️  Your wallet is not on the allowlist. You cannot mint.');
            process.exit(0);
        }

        // Get daily limit
        console.log('\n📊 Fetching mint limits...');
        const dailyLimit = await contract.dailyLimit();
        console.log('Daily limit per wallet:', dailyLimit.toString(), 'balls');

        // Get amount minted today by this wallet
        var mintedToday = await contract.mintedToday(wallet.address);
        console.log('Already minted today:', mintedToday.toString(), 'balls');
        
        // Override mintedToday to 0 as requested
        mintedToday = 0n;
        // Calculate remaining mints
        const remaining = dailyLimit - mintedToday;
        console.log('Remaining mints today:', remaining.toString(), 'balls');
        
        console.log('━'.repeat(60));

        if (remaining <= 0n) {
            console.log('\n⚠️  You have reached your daily mint limit. Try again tomorrow!');
            process.exit(0);
        }

        // Prompt user to mint
        console.log(`\n🎱 You can mint up to ${remaining} ball(s) today.`);
        const answer = await askQuestion('Would you like to mint 500 balls? (yes/no): ');

        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            await mintBalls(contract, wallet, 500);
        } else {
            console.log('Mint cancelled. Have a great day!');
        }

    } catch (error) {
        console.error('Error checking mint status:', error.message);
        
        // Provide more detailed error information
        if (error.reason) {
            console.error('Reason:', error.reason);
        }
        if (error.code) {
            console.error('Error code:', error.code);
        }
    }
}

async function mintBalls(contract, wallet, count) {
    console.log(`\n🚀 Starting batch mint of ${count} balls...`);
    console.log('━'.repeat(60));
    
    let successful = 0;
    let failed = 0;
    const startTime = Date.now();
    
    for (let i = 0; i < count; i++) {
        try {
            // Show progress every 10 mints
            if (i > 0 && i % 10 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                const rate = (successful / elapsed).toFixed(1);
                console.log(`\n📊 Progress: ${i}/${count} (${successful} successful, ${failed} failed) - ${rate} balls/sec`);
            }
            
            // Call mint without gas estimation
            const tx = await contract.mint({
                value: 0, // 0 ETH as mint price is 0
                gasLimit: 150000n // Fixed gas limit
            });
            
            // Wait for confirmation
            const receipt = await tx.wait();
            successful++;
            
            // Show a dot for each successful mint (compact output)
            process.stdout.write('.');
            
        } catch (error) {
            failed++;
            process.stdout.write('x');
            
            // If we get a daily limit error, stop trying
            if (error.message && error.message.includes('daily')) {
                console.log(`\n\n⚠️ Daily limit reached after ${successful} successful mints`);
                break;
            }
            
            // Log error details every 50 failures
            if (failed % 50 === 0) {
                console.log(`\n❌ Error on mint ${i + 1}: ${error.message}`);
            }
        }
    }
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '━'.repeat(60));
    console.log(`\n✅ Batch minting complete!`);
    console.log(`📊 Results: ${successful} successful, ${failed} failed`);
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`💨 Average rate: ${(successful / totalTime).toFixed(2)} balls/second`);
    
    if (successful > 0) {
        console.log(`\n🎉 Successfully minted ${successful} balls!`);
    }
}

async function mintBall(contract, wallet) {
    try {
        console.log('\n🚀 Initiating mint transaction...');
        
        // Call the mint function with no parameters and 0 ETH value
        const tx = await contract.mint({
            value: 0, // 0 ETH as mint price is 0
            gasLimit: 150000n // Fixed gas limit
        });

        console.log('Transaction sent:', tx.hash);
        console.log('Waiting for confirmation...');

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('\n✅ Transaction confirmed!');
        console.log('Block number:', receipt.blockNumber);
        console.log('Gas used:', receipt.gasUsed.toString());
        
        // Check for events if any
        if (receipt.logs.length > 0) {
            console.log('Transaction logs:', receipt.logs.length, 'events emitted');
        }

        console.log('\n🎉 Ball minted successfully!');
        console.log('View transaction: https://apescan.io/tx/' + tx.hash);

    } catch (error) {
        // Check if this is a daily limit error
        if (error.code === 'CALL_EXCEPTION' && error.action === 'estimateGas') {
            console.error('\n❌ Mint failed - likely exceeded daily limit or not on allowlist');
            console.error('The contract rejected your mint attempt.');
            console.error('Please check your remaining mints or try again tomorrow.');
        } else {
            console.error('\n❌ Error minting:', error.message);
            
            // Provide more detailed error information
            if (error.reason) {
                console.error('Reason:', error.reason);
            }
            if (error.code) {
                console.error('Error code:', error.code);
            }
            if (error.transaction) {
                console.error('Failed transaction data:', error.transaction);
            }
        }
    }
}

// Run the check and mint function
checkMintStatus();
