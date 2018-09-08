const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Blockchain = require('./blockchain.js').Blockchain;
const blockchain = new Blockchain();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const server = app.listen(5000, () => {
    console.log('http://localhost:' + server.address().port);
});

app.get('/', (req, res) => {
    res.send('Node js is listening to PORT: ' + server.address().port);    
});


app.get('/mine', (req, res) => {
    const lastBlock = blockchain.lastBlock;
    const proof = blockchain.getProofOfWork(lastBlock);

    blockchain.createNewTransaction(
        sender = 1,
        recipient = 'localhost',
        amount = 1
    );

    previousHash = blockchain.getBlockHash(lastBlock);
    block = blockchain.createNewBlock(proof, previousHash);

    res.send({
        message: 'New Block Forged',
        index: block.index,
        transactions: block.transactions,
        proof: block.proof,
        previousHash: block.previousHash
    });
});

app.get('/chain', (req, res) => {
    res.send({
        chain: blockchain.chain,
        length: blockchain.chain.length
    });
});

app.post('/transactions/new', (req, res) => {
    console.log(req.body);

    const index = blockchain.createNewTransaction(
        req.body.sender,
        req.body.recipient,
        req.body.amount
    );

    res.send({
        message: `Transaction will be added to block ${index}`
    });
});


