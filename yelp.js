require("dotenv").config();
const yelp = require("yelp-fusion");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const client = yelp.client(process.env.CLIENT_SECRET);

const csvWriter = createCsvWriter({
  path: "database/food.csv",
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
    { id: "address", title: "address" },
    { id: "location_searched", title: "location_searched" }
  ],
  append: "true"
});

const sf_zip_codes = [
  94102,
  94103,
  94104,
  94105,
  94107,
  94108,
  94109,
  94110,
  94111,
  94112,
  94114,
  94115,
  94116,
  94117,
  94118,
  94121,
  94122,
  94123,
  94124,
  94127,
  94129,
  94130,
  94131,
  94132,
  94133,
  94134,
  94158
];

const writeDatabase = () => {};

const yelpAPILoop = async (locations, term, limit) => {
  try {
    console.log(`Term: ${term}`);
    for (zipcode of locations) {
      console.log(`Location: ${zipcode}`);
      for (let offset = 0; offset < 1000; offset += 50) {
        console.log(`We are currently at page: ${Math.round(offset / 50)}`);
        let restaurants = await yelpAPISearch(zipcode, term, limit, offset);
        await writeToCSV(restaurants);
      }
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

const writeToCSV = async data => {
  await csvWriter.writeRecords(data);
  console.log("Successfully written to database");
};

const yelpAPISearch = async (location, term, limit, offset) => {
  let response = await client.search({ location, term, limit, offset });
  let data = response.jsonBody.businesses;
  data.forEach(element => {
    element.longitude = element.coordinates.longitude;
    element.latitude = element.coordinates.latitude;
    element.address = element.location.display_address;
    element.location_searched = location;
    let string = "";

    element.categories.forEach(category => {
      string = `${string}${category.alias},`;
    });
    element.categories = string;
  });
  return data;
};

wait = async delay => {
  return new Promise(function(resolve) {
    setTimeout(resolve, randomNumber(delay, delay * 2));
  });
};

randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// yelpAPISearch("san francisco", "food", 50, 50;

yelpAPILoop(sf_zip_codes, "food", 50);
