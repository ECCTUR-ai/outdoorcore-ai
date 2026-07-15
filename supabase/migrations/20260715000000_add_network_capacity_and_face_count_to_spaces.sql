-- Migration to add network_capacity and face_count columns to spaces table
ALTER TABLE IF EXISTS spaces 
ADD COLUMN IF NOT EXISTS network_capacity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS face_count INTEGER DEFAULT 1;

-- Add comments for documentation
COMMENT ON COLUMN spaces.network_capacity IS 'Maximum network slots/playlist capacity of the digital screen';
COMMENT ON COLUMN spaces.face_count IS 'Number of physical faces/surfaces of this advertising space';
