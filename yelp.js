require("dotenv").config();
const yelp = require("yelp-fusion");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const jsonexport = require("jsonexport");

const csvWriter = createCsvWriter({
  path: "dummy.csv",
  header: [
    { id: "id", title: "id" },
    { id: "alias", title: "alias" },
    { id: "name", title: "name" },
    { id: "image_url", title: "image_url" },
    { id: "url", title: "url" },
    { id: "review_count", title: "review_count" },
    { id: "categories", title: "categories" },
    { id: "rating", title: "rating" },
    { id: "transactions", title: "transactions" },
    { id: "price", title: "price" },
    { id: "phone", title: "phone" },
    { id: "latitude", title: "latitude" },
    { id: "longitude", title: "longitude" },
    { id: "address", title: "address" }
  ]
});

const client = yelp.client(process.env.CLIENT_SECRET);

client
  .search({
    location: "san francisco, ca"
  })
  .then(response => {
    // console.log(response.jsonBody.businesses[0]);
    //
    let data = response.jsonBody.businesses;

    console.log(data[0]);

    data.forEach(element => {
      element.longitude = element.coordinates.longitude;
      element.latitude = element.coordinates.latitude;
      element.address = element.location.display_address;
      let string = "";

      element.categories.forEach(category => {
        string = `${string}${category.alias};`;
      });
      element.categories = string;
    });

    csvWriter
      .writeRecords(data) // returns a promise
      .then(() => {
        console.log("...Done");
      });
  })
  .catch(e => {
    console.log(e);
  });
