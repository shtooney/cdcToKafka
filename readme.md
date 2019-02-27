# Change Data Capture -> Kafka scrub code

Ok straight up - I haven't done all the whatnot you need on here to deploy, or added deploy steps. But you can look at the app.js file and get a feel for what this does.

Big ups to https://github.com/heroku/no-kafka for how I'm hitting Kafka
 

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