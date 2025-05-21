/*
  # Initial Schema Setup for Flavens Restaurant

  1. New Tables
    - users
      - user_id (uuid, references auth.users)
      - email (text)
      - name (text)
      - role (text)
      - created_at (timestamptz)
      - user_context (jsonb)
    
    - menu_items
      - id (uuid)
      - name (text)
      - description (text)
      - price (numeric)
      - category (text)
      - image (text)
      - available (boolean)
      - tags (text[])
      - created_at (timestamptz)
    
    - orders
      - id (uuid)
      - user_id (uuid)
      - items (jsonb)
      - total (numeric)
      - status (text)
      - created_at (timestamptz)
    
    - reservations
      - id (uuid)
      - user_id (uuid)
      - date (date)
      - time (text)
      - guests (integer)
      - notes (text)
      - status (text)
      - created_at (timestamptz)
    
    - daily_menus
      - id (uuid)
      - date (date)
      - items (jsonb)
      - created_at (timestamptz)
    
    - feedback
      - id (uuid)
      - user_id (uuid)
      - order_id (uuid)
      - rating (integer)
      - comment (text)
      - created_at (timestamptz)
    
    - ai_sessions
      - id (uuid)
      - user_id (uuid)
      - context (jsonb)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  user_context jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text NOT NULL,
  image text,
  available boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Daily menus table
CREATE TABLE IF NOT EXISTS daily_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily menus"
  ON daily_menus
  FOR SELECT
  TO authenticated
  USING (true);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  order_id uuid REFERENCES orders(id),
  rating integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- AI sessions table
CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI sessions"
  ON ai_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI sessions"
  ON ai_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);