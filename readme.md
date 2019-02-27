# Change Data Capture -> Kafka scrub code

## Ramblin's
Ok straight up - this is not stress/scale/enterprise ready. It's a simplistic baseline implementation of pulling via CometD/Faye from Salesforce's CDC bus, and inserting that content without transformation into Heroku Kafka for broader pub/sub usage. You're gonna want/need logic to handle disconnects, gaps, etc. to implement this as a replication system for sure. But it IS a fairly straightforward implementation, and I've purposely encased everything within app.js for easy following.

Big ups to https://github.com/heroku/no-kafka for how I'm hitting Kafka, and Faye for my CometD consumption.
 
 ## Setup

1. YOU NEED A SF ORG BRAH. I mean we're CDC'in from something amirite? So either hit up developer.salesforce.com or Trailhead or your dev hub (ideally).
2. Activate that CDC - go [here for instructions on that](https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_select_objects.htm)
3. Create a new [Connected App](https://help.salesforce.com/apex/HTViewHelpDoc?id=connected_app_create.htm&language=en_us) for those sweet, sweet OAuth deets in your SF org. You'll need them deets for the Heroku deploy.
4. [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) Use this Heroku button to deploy you this app. It's gonna crash at first, that's ok. You'll note this doesn't add the Kafka add-on. That's weird, right? ON TO STEP 5!
5. Go into your Heroku app and **add a Kafka instance**. It's critical you understand here: *There is NO FREE KAFKA. You will incur charges with Heroku if you do this*. If you don't want to, either install a local version of Kakfa on your localhost, and alter the connection string to point there, or just look through my code and and be amazed I'm employed. This is why it wasn't in the button (thinkingman.gif).
6. Add a Kafka Topic, and then put it in your environment settings. You can do this by gettin in your Heroku CLI, and running the following:
 `heroku plugins:install heroku-kafka` - because you might not have the addon
 `heroku kafka:topics:create MY_TOPIC_NAME_HERE` - create the topic, but make sure this topic name matches the one you entered in the env variable KAFKA_TOPIC. **If on shared tier** - you will also get back your Kafka prefix, which needs to be put into the KAFKA_PREFIX env variable.
7. Reset yo Dynos if you werent toying with env variables, and you should be all set.
8. Profit?

## Walkthrough for the less code inclined
``` node.js
//Yer standard includes. Nforce for SF Auth, Faye for cometD, no-kafka for yes-kafka, and fs for a thing.
const nforce = require('nforce');
const fs = require('fs');
const Kafka = require('no-kafka');
const faye = require('faye');
```

```node.js
//This is the fs thing. no-kafka likes its certs in files.
fs.writeFileSync('./client.crt', process.env.KAFKA_CLIENT_CERT);
fs.writeFileSync('./client.key', process.env.KAFKA_CLIENT_CERT_KEY);

//create the Kafka producer for great justice later
const producer = new Kafka.Producer({
    connectionString: process.env.KAFKA_URL,
    ssl: {
      certFile: './client.crt',
      keyFile: './client.key'
    }
});
```

```node.js
//nforce's authentication to Salesforce org
const org = nforce.createConnection({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: process.env.ENVIRONMENT,
  mode: 'single',
});
```

```node.js
//Init the Producer, then auth the org, then subscribe to the channel, then on every message, victory.
return producer.init().then(function(){
    console.log('Producer Initiated');
    org.authenticate({username: process.env.SFDCUSERNAME, password: process.env.SFDCPASSWORD}, function(err, resp){
        ...
```