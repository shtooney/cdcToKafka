const nforce = require('nforce');
const fs = require('fs');
const Kafka = require('no-kafka');

fs.writeFileSync('./client.crt', process.env.KAFKA_CLIENT_CERT);
fs.writeFileSync('./client.key', process.env.KAFKA_CLIENT_CERT_KEY);

const org = nforce.createConnection({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: process.env.ENVIRONMENT,
  mode: 'single',
});

const producer = new Kafka.Producer({
  connectionString: process.env.KAFKA_URL,
  ssl: {
    certFile: './client.crt',
    keyFile: './client.key',
  },
});

return producer.init().then(function(){
    console.log('Producer Connected');
    producer.send({
        topic: 'caseActivity',
        partition: 0,
        message: {
            value: 'Test Write'
        },
    }).then(function (result) {
        console.log(result);
    });
});