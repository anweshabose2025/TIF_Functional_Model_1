/*
  # Create assumptions storage table

  1. New Tables
    - `assumptions`
      - `id` (integer, primary key) - Always 1, single row
      - `data` (jsonb) - The complete assumptions object
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `assumptions` table
    - Add public read/write policies since there's no authentication
  
  3. Initial Data
    - Insert a default row with id=1
*/

CREATE TABLE IF NOT EXISTS assumptions (
  id integer PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Only allow one row
CREATE UNIQUE INDEX IF NOT EXISTS assumptions_single_row ON assumptions (id);

-- Add constraint to ensure id is always 1
ALTER TABLE assumptions ADD CONSTRAINT assumptions_id_check CHECK (id = 1);

-- Enable RLS
ALTER TABLE assumptions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read assumptions"
  ON assumptions
  FOR SELECT
  TO public
  USING (true);

-- Allow public write access (insert/update)
CREATE POLICY "Anyone can insert assumptions"
  ON assumptions
  FOR INSERT
  TO public
  WITH CHECK (id = 1);

CREATE POLICY "Anyone can update assumptions"
  ON assumptions
  FOR UPDATE
  TO public
  USING (id = 1)
  WITH CHECK (id = 1);

-- Update the updated_at timestamp on update
CREATE OR REPLACE FUNCTION update_assumptions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assumptions_updated_at
  BEFORE UPDATE ON assumptions
  FOR EACH ROW
  EXECUTE FUNCTION update_assumptions_timestamp();
