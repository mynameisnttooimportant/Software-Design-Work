-- I was curious about earthquakes where are reasonably deep with low error. 
-- I don't know what causes the error to be low, so this was interesting to me
SELECT *
FROM earthquakes
WHERE depthError < 2
  AND quakeDepth > 100
ORDER BY quakeDepth DESC; -- make the deepest appear first



-- nst is "Number of seismic stations which reported P- and S-arrival times for this earthquake." 
-- (https://scedc.caltech.edu/recent/glossary.html#:~:text=Nst,Nph)
-- quite a few nst values are blanking, meaning no stations. 
-- I'm curious about the relationship between blank nst values, magnitute and depth
-- So, I created a query to only select blank nst values, only magninute greater than 3,
-- and sort by depth
SELECT *
FROM earthquakes
WHERE nst IS NULL
  AND mag > 3
ORDER BY quakeDepth DESC;


-- Magnitute and depth both have error values that I kept, so I made another query to see
-- earthquakes that have low error in both. I sorted by magnitute this time, instead of depth.
SELECT *
FROM earthquakes
WHERE depthError < 2
  AND magError < 0.1
ORDER BY mag DESC;

