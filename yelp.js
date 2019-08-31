require("dotenv").config();
const yelp = require("yelp-fusion");

const client = yelp.client(process.env.CLIENT_SECRET);

client
  .search({
    location: "san francisco, ca"
  })
  .then(response => {
    console.log(response.jsonBody.businesses);
  })
  .catch(e => {
    console.log(e);
  });
