
ALTER TABLE public.pixels
  ADD COLUMN IF NOT EXISTS pending_until timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS pixels_xy_unique ON public.pixels(x, y);
