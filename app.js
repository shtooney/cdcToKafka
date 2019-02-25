const nforce = require('nforce');
const fs = require('fs');
const Kafka = require('no-kafka');
const faye = require('faye');

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
    org.authenticate({username: process.env.SFDCUSERNAME, password: process.env.SFDCPASSWORD}, function(err, resp){
        if(!err){
            console.log('SFDC Auth Connected');
            console.log(`attempting client at ${org.oauth.instance_url}/cometd/45.0/`);
            var fClient = new faye.Client(`${org.oauth.instance_url}/cometd/45.0/`);
            fClient.setHeader('Authorization', 'OAuth ' + org.oauth.access_token);
            fClient.subscribe('data/CaseChangeEvent', function(message){
                console.log('we GOT ONE');
                console.log(message.payload);
            });
        }
    });
    
    /*
    producer.send({
        topic: `${process.env.KAFKA_PREFIX}caseActivity`,
        partition: 0,
        message: {
            value: 'Test Write'
        },
    }).then(function (result) {
        console.log(result);
    });
    */
});