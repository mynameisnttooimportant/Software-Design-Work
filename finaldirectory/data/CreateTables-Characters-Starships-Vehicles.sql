DROP TABLE IF EXISTS characters;
CREATE TABLE characters (
  name text,
  height real,
  mass real,
  hair_color text,
  skin_color text,
  eye_color text, 
  birth_year text, 
  gender text, 
  homeworld text,
  species text
);

DROP TABLE IF EXISTS starships;
CREATE TABLE starships (
  name text,
  model text,
  manufacturer text,
  cost real,
  length real,
  max_atmosphering_speed real, 
  crew real, 
  passengers real, 
  cargo_capacity real,
  consumables text,
  hyperdrive_rating real, 
  MGLT real,
  starship_class text
);

DROP TABLE IF EXISTS vehicles;
CREATE TABLE vehicles (
  name text,
  model text,
  manufacturer text,
  cost real,
  length real,
  max_atmosphering_speed real, 
  crew real, 
  passengers real, 
  cargo_capacity real,
  consumables text,
  class text
);
