-- Combined schema migration generated from project SQL files

-- Begin: 20260613173331_0363b42c-87e8-48b1-a0e4-f44c992f31de.sql

-- Roles
CREATE TYPE IF NOT EXISTS public.app_role AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY IF NOT EXISTS "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Frames catalog
CREATE TABLE IF NOT EXISTS public.frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  size TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.frames TO anon, authenticated;
GRANT ALL ON public.frames TO service_role;
ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can view active frames" ON public.frames
  FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "Admins manage frames" ON public.frames
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.frames (size, price, sort_order) VALUES
  ('6x4 inches', 250, 1),
  ('10x8 inches', 350, 2),
  ('12x8 inches', 500, 3),
  ('10x12 inches', 750, 4),
  ('10x15 inches', 800, 5),
  ('12x18 inches', 1100, 6),
  ('16x24 inches', 1700, 7)
ON CONFLICT (size) DO NOTHING;

-- Contact submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admins view contacts" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Bookings/orders
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  frame_size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can book" ON public.bookings
  FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admins view bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY IF NOT EXISTS "Admins update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Admins manage customers" ON public.customers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Begin: additional SQL files (orders, policies, mobile_cases, audit, updates)

-- Orders table and policies (from 20260615071036...)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  pincode text,
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  payment_method text NOT NULL,
  payment_ref text,
  status text NOT NULL DEFAULT 'pending',
  notes text
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies are applied separately by later migration steps

-- Order tracking and triggers (from 20260617180644...)
DO $$ BEGIN
  ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS tracking_token text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex');
EXCEPTION WHEN undefined_table THEN
  -- table might not exist yet; ignore
  NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- Constrain status values
DO $$ BEGIN
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending','processing','confirmed','shipped','delivered','cancelled'));
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- Update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mobile cases
CREATE TABLE IF NOT EXISTS public.mobile_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 299,
  image_url text NOT NULL,
  available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mobile_cases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mobile_cases TO authenticated;
GRANT ALL ON public.mobile_cases TO service_role;
ALTER TABLE public.mobile_cases ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER IF NOT EXISTS update_mobile_cases_updated_at
  BEFORE UPDATE ON public.mobile_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.mobile_cases (title, tag, price, image_url, sort_order) VALUES
  ('Couple Custom Case', 'Sweet Hearts', 299, '/__l5e/assets-v1/placeholder-couple/case-couple.png', 10),
  ('Family Custom Case', 'Tamil Quote', 299, '/__l5e/assets-v1/placeholder-family/case-family.png', 20),
  ('Sweet Hearts Case', 'Couple Photo', 199, '/__l5e/assets-v1/placeholder-sweet/case-sweethearts.png', 30),
  ('Family Love Case', 'Tamil Family', 199, '/__l5e/assets-v1/placeholder-family2/case-family2.png', 40)
ON CONFLICT (title) DO NOTHING;

-- Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email text,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('insert','update','delete')),
  field text,
  old_value text,
  new_value text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_audit_log_table_record_idx ON public.admin_audit_log (table_name, record_id);
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Log trigger function
CREATE OR REPLACE FUNCTION public.log_admin_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_email text;
  v_id uuid;
  v_fields text[];
  v_field text;
  v_old text;
  v_new text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = v_actor;

  IF TG_TABLE_NAME = 'frames' THEN
    v_fields := ARRAY['price','is_active','size'];
  ELSIF TG_TABLE_NAME = 'mobile_cases' THEN
    v_fields := ARRAY['price','available','image_url','title','tag'];
  ELSE
    v_fields := ARRAY[]::text[];
  END IF;

  IF TG_OP = 'INSERT' THEN
    v_id := (to_jsonb(NEW) ->> 'id')::uuid;
    INSERT INTO public.admin_audit_log(actor_id, actor_email, table_name, record_id, action, field, old_value, new_value)
    VALUES (v_actor, v_email, TG_TABLE_NAME, v_id, 'insert', NULL, NULL, to_jsonb(NEW)::text);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_id := (to_jsonb(OLD) ->> 'id')::uuid;
    INSERT INTO public.admin_audit_log(actor_id, actor_email, table_name, record_id, action, field, old_value, new_value)
    VALUES (v_actor, v_email, TG_TABLE_NAME, v_id, 'delete', NULL, to_jsonb(OLD)::text, NULL);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    v_id := (to_jsonb(NEW) ->> 'id')::uuid;
    FOREACH v_field IN ARRAY v_fields LOOP
      v_old := to_jsonb(OLD) ->> v_field;
      v_new := to_jsonb(NEW) ->> v_field;
      IF v_old IS DISTINCT FROM v_new THEN
        INSERT INTO public.admin_audit_log(actor_id, actor_email, table_name, record_id, action, field, old_value, new_value)
        VALUES (v_actor, v_email, TG_TABLE_NAME, v_id, 'update', v_field, v_old, v_new);
      END IF;
    END LOOP;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_admin_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER IF NOT EXISTS frames_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.frames
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();

CREATE TRIGGER IF NOT EXISTS mobile_cases_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.mobile_cases
  FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();

-- Policies and protections (from 20260615063838... and others)
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

-- Tighten contact_submissions policy
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 100
    AND length(trim(message)) BETWEEN 1 AND 2000
    AND (email IS NULL OR length(email) <= 255)
    AND (phone IS NULL OR length(phone) <= 30)
  );

-- Tighten bookings policy
DROP POLICY IF EXISTS "Anyone can book" ON public.bookings;
CREATE POLICY "Anyone can book"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(customer_name)) BETWEEN 1 AND 100
    AND length(trim(phone)) BETWEEN 5 AND 30
    AND quantity BETWEEN 1 AND 100
    AND (email IS NULL OR length(email) <= 255)
    AND (frame_size IS NULL OR length(frame_size) <= 50)
    AND (notes IS NULL OR length(notes) <= 2000)
  );

-- Remove old client-side order policies and RPCs (safe no-ops if missing)
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
DROP FUNCTION IF EXISTS public.get_order_by_token(text);

-- Auto-assign admin on signup and grant customer view by email
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'rithishsekar421@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_signup();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'rithishsekar421@gmail.com'
ON CONFLICT DO NOTHING;

-- Customers view own orders
CREATE POLICY IF NOT EXISTS "Customers view own orders" ON public.orders
FOR SELECT TO authenticated
USING (email IS NOT NULL AND lower(email) = lower(auth.jwt() ->> 'email'));

GRANT SELECT ON public.orders TO authenticated;

-- Final revocations
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
