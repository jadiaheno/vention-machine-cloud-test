-- Custom SQL migration file, put you code below! --
CREATE VIEW "venti_ratings" AS
SELECT va.album_id,  va.name, AVG(vaur.rating) as mean_rating
FROM venti_albums va, venti_album_user_ratings vaur
WHERE va.album_id = vaur.album_id
GROUP BY va.album_id, va.name;