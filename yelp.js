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
    { id: "offset", title: "offset" }
  ],
  append: "true"
});

const writeDatabase = () => {};

const yelpAPILoop = async (location, term, limit) => {
  console.log(`Location: ${location}`);
  console.log(`Term: ${term}`);
  try {
    for (let offset = 0; offset <= 1000; offset = offset + 50) {
      console.log(`We are currently at page: ${Math.round(offset / 50)}`);
      let restaurants = await yelpAPISearch(location, term, limit, offset);
      await writeToCSV(restaurants);
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
    element.offset = offset;
    let string = "";

    element.categories.forEach(category => {
      string = `${string}${category.alias};`;
    });
    element.categories = string;
  });

  console.log(data);

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

// yelpAPISearch("san francisco", "food", 50, 10);

yelpAPILoop("san francisco, ca", "food", 50);
