CREATE TABLE IF NOT EXISTS app_settings (key text PRIMARY KEY,value text NOT NULL DEFAULT '',updated_at timestamptz DEFAULT now());
INSERT INTO app_settings(key,value) VALUES ('site_name','AnimeVerse'),('maintenance_mode','false'),('default_page_size','24') ON CONFLICT(key) DO NOTHING;
