CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),email text UNIQUE NOT NULL,name text DEFAULT '',password_hash text NOT NULL,role text NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),created_at timestamptz DEFAULT now(),updated_at timestamptz DEFAULT now());
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
