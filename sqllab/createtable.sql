DROP TABLE IF EXISTS earthquakes;
CREATE TABLE earthquakes (
  quaketime time with time zone,
  latitude real,
  longitude real,
  quakedepth real,
  mag real,
  nst real, 
  gap real, 
  rms real, 
  id text,
  place text,
  deptherror text, 
  magerror text, 
  locationsource
);
