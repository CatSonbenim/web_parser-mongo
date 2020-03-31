const MongoClient = require("mongodb").MongoClient;

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
.withCapabilities(webdriver.Capabilities.chrome())
.build();

driver.get('http://reyestr.court.gov.ua');
driver.findElement(webdriver.By.id('CaseNumber')).sendKeys('822/3408/17');
driver.findElement(webdriver.By.id('btn')).click();
driver.wait(webdriver.until.elementLocated(webdriver.By.id('divresult'))).then(function () {
    driver.findElements(webdriver.By.className('doc_text2')).then((text2) => {
        for (var elem of text2){
            elem.getText().then((element) => {
                const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
                mongoClient.connect(function(err, client){

                    if(err){
                        return console.log(err);
                    }

                    const db = client.db("usersdb");
                    const collection = db.collection("users");

                    collection.insertOne({'case': '822/3408/17', 'url': 'http://reyestr.court.gov.ua/Review/'
                            + element}, function(err, results){

                        console.log(results);
                        client.close();
                    });
                });
                console.log(element)
            })
        }}
        )});
