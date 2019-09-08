library(tidyverse)
library(janitor)
library(tidyr)
library(sf)
library(geojsonR)
library(geojsonio)

# Custom function which labels operations with the region they inhabit.
# That is, which region in europe or the pacific does this aerial operation reside in?
geo_inside <- function(lon, lat, map, variable) {
  
  variable <- enquo(variable)
  
  pt <- tibble::data_frame(x = lon,
                           y = lat) %>%
    st_as_sf(coords = c("x", "y"), crs = st_crs(map))
  pt %>% st_join(map) %>% pull(!!variable)
  
}


yelp_data_cleaned <- read_csv("Documents/d3_projects/gentrification_vis/database/food.csv") %>% clean_names() %>%
  drop_na(price) %>%
  drop_na(longitude) %>%
  mutate(lat = as.numeric(latitude)) %>%
  drop_na(latitude) %>%
  distinct(., id, .keep_all= TRUE)

yelp_data_cleaned %>%
  ggplot(aes(price)) +
  geom_bar()

yelp_data_priced <- yelp_data_cleaned %>%
  mutate(price2 = if_else(price == '$$$$' | price == '$$$', 'High', price)) %>%
  mutate(price3 = if_else(price2 == '$$', 'Med', price2)) %>%
  select(-price2, -price) %>%
  mutate(price = if_else(price3 == '$', 'Low', price3)) %>%
  select(-price3)
  

sftracts <- geojson_read("Documents/d3_projects/gentrification_vis/sfmap_files/2010_sf_census_tracts_without_water_clippings.geojson", what = "sp") %>%
  geojson_json(.) %>%
  geojson_sf(.)

sftracts_use <- sftracts %>% 
  as_tibble() %>% 
  mutate(area = st_area(geometry)) %>% 
  arrange(area) %>%
  tail(194) %>%
  st_as_sf()

yelp_data_tracts <- yelp_data_priced %>%
  mutate(census_tract = geo_inside(longitude, latitude, sftracts_use, NAMELSAD10))

write_csv(yelp_data_tracts, "Documents/d3_projects/gentrification_vis/database/food_tracts.csv")


yelp_data_tracts %>%
  ggplot(aes(census_tract)) +
  geom_bar()



