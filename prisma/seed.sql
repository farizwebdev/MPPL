-- Seed services
INSERT INTO "services" ("id", "name", "price_per_kg", "estimated_time", "created_at", "updated_at")
VALUES 
  ('REGULER', 'Reguler (3 hari)', 4000, '3 hari', NOW(), NOW()),
  ('KILAT_2', 'Kilat (2 hari)', 5000, '2 hari', NOW(), NOW()),
  ('KILAT_1', 'Kilat (1 hari)', 8000, '1 hari', NOW(), NOW()),
  ('EXPRESS', 'Express (5 jam)', 10000, '5 jam', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "price_per_kg" = EXCLUDED."price_per_kg",
  "estimated_time" = EXCLUDED."estimated_time";
