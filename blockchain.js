const jsSHA = require("jssha");

class Blockchain {
    constructor() {
        this.currentTransactions = [];
        this.chain = [];
        this.lastBlock = null;
        this.nodes = new Set();
    }

    isValidChain(chain) {
        let currentBlock = chain[0];
        let currentIndex = 1

        while(currentIndex < chain.length) {
            const block = chain[currentIndex];
            console.log(`${currentBlock}`);
            console.log(`${block}`);
            console.log('----------');
            
            const currentBlockHash = getBlockHash(currentBlock);
            if(block.previousHash != currentBlockHash) {
                return false;
            }

            currentBlock = block;
            currentIndex++;
        }

        return true;
    }

    createNewBlock(proof, opt_previousHash = null) {
        const block = {
            index: length(this.chain) + 1, 
            timestamp: (() => {
                const date = new Date();
                return Math.floor(date.getTime / 1000);
            })(),
            transactions: Object.assign({}, this.currentTransactions),
            proof: proof,
            previousHash: (opt_previousHash == null) ? null : getBlockHash(this.lastBlock)
        };

        this.currentTransactions = [];
        this.chain.push(block);
        this.lastBlock = block;
        return block;
    }

    createNewTransaction(sender, recipient, amount) {
        this.currentTransactions.push({
            sender: sender,
            recipient: recipient,
            amount: amount
        });

        return this.lastBlock.index + 1;
    }

    static getBlockHash(block) {
        const shaObj = new jsSHA('SHA-256', 'TEXT');
        shaObj.update(JSON.stringify(block));
        return shaObj.getHash('HEX');
    }

    getProofOfWork(lastProof) {
        let proof = 0;
        while(!Blockchain.isValidProof(lastProof, proof)) {
            proof++;
        }
        return proof;
    }

    static isValidProof(lastProof, proof) {
        const shaObj = new jsSHA('SHA-256', 'TEXT');
        shaObj.update(`${lastProof}${proof}`);
        const guassHash = shaObj.getHash('HEX');
        return guassHash.slice(0, 4) == '0000';
    }
}

module.exports.Blockchain = Blockchain;
