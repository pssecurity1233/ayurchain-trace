-- ============================================
-- PRIORITY 1: FIX CRITICAL ROLE MIGRATION
-- Part 2: Migrate data and create triggers
-- ============================================

-- STEP 1: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role::text::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- STEP 2: Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    user_id,
    name,
    phone,
    role,
    organization,
    address,
    license_number
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    (NEW.raw_user_meta_data->>'role')::user_role,
    NEW.raw_user_meta_data->>'organization',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'license_number'
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- STEP 3: Create trigger on auth.users for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 4: Create function to sync role changes from profiles to user_roles
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, NEW.role::text::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN NEW;
  END IF;
  
  IF (TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role) THEN
    DELETE FROM public.user_roles 
    WHERE user_id = NEW.user_id AND role = OLD.role::text::app_role;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, NEW.role::text::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- STEP 5: Create trigger on profiles table to auto-sync roles
DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role();

-- STEP 6: Verify migration and show results
DO $$
DECLARE
  profile_count INTEGER;
  user_role_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles WHERE role IS NOT NULL;
  SELECT COUNT(*) INTO user_role_count FROM public.user_roles;
  
  RAISE NOTICE '✓ Role migration complete!';
  RAISE NOTICE '  - Profiles with roles: %', profile_count;
  RAISE NOTICE '  - User role entries: %', user_role_count;
  RAISE NOTICE '✓ Auto-sync triggers created';
  RAISE NOTICE '  - New user registration trigger';
  RAISE NOTICE '  - Profile role change sync trigger';
END $$;