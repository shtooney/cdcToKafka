# Change Data Capture -> Kafka scrub code

Ok straight up - I haven't done all the whatnot you need on here to deploy, or added deploy steps. But you can look at the app.js file and get a feel for what this does.

Big ups to https://github.com/heroku/no-kafka for how I'm hitting Kafka
 

1. YOU NEED A SF ORG BRAH. I mean we're CDC'in from something amirite? So either hit up developer.salesforce.com or Trailhead or your dev hub (ideally).
2. Activate that CDC - go [here for instructions on that](https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_select_objects.htm)
3. Create a new [Connected App](https://help.salesforce.com/apex/HTViewHelpDoc?id=connected_app_create.htm&language=en_us) for those sweet, sweet OAuth deets in your SF org. You'll need them deets for the Heroku deploy.
4. Use this Heroku button to deploy you this app. It's gonna crash at first, that's ok.
5. Go into your Heroku app and **add a Kafka instance**. It's critical you understand here: *There is NO FREE KAFKA. You will incur charges with Heroku if you do this*. If you don't want to, either install a local version of Kakfa on your localhost, and alter the connection string to point there, or just look through my code and and be amazed I'm employed. I am.
6. Add a Kafka Topic, and then put it in your environment settings.
7. ???
8. Profit?