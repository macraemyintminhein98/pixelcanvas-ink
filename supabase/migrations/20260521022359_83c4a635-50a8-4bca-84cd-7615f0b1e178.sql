
CREATE TABLE public.pixels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT '#ff5722',
  image_url TEXT,
  owner_name TEXT NOT NULL,
  owner_url TEXT,
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pixels_x_range CHECK (x >= 0 AND x < 100),
  CONSTRAINT pixels_y_range CHECK (y >= 0 AND y < 100),
  CONSTRAINT pixels_xy_unique UNIQUE (x, y)
);

CREATE INDEX pixels_xy_idx ON public.pixels (x, y);

ALTER TABLE public.pixels ENABLE ROW LEVEL SECURITY;

-- Public read (canvas is public)
CREATE POLICY "Pixels are viewable by everyone"
  ON public.pixels FOR SELECT
  USING (true);

-- No client-side inserts/updates/deletes. Only service role (server) writes.
