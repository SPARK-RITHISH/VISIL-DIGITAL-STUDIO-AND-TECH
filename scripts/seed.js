#!/usr/bin/env node
// Ensure Node can run this as an ES module when using `node --loader` if needed.
/**
 * seeds demo frames and an admin user/role using Supabase service key
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.js
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log('Seeding frames...');
  const frames = [
    { size: '6x4 inches', price: 250, sort_order: 1, image_url: '/assets/frames/frame-6x4.svg' },
    { size: '10x8 inches', price: 350, sort_order: 2, image_url: '/assets/frames/frame-10x8.svg' },
    { size: '12x8 inches', price: 500, sort_order: 3, image_url: '/assets/frames/frame-12x8.svg' },
    { size: '10x12 inches', price: 750, sort_order: 4, image_url: '/assets/frames/frame-10x12.svg' },
    { size: '10x15 inches', price: 800, sort_order: 5, image_url: '/assets/frames/frame-10x15.svg' },
    { size: '12x18 inches', price: 1100, sort_order: 6, image_url: '/assets/frames/frame-12x18.svg' },
    { size: '16x24 inches', price: 1700, sort_order: 7, image_url: '/assets/frames/frame-16x24.svg' },
  ];

  for (const f of frames) {
    const { error } = await supabase.from('frames').upsert(f, { onConflict: 'size' });
    if (error) console.error('Frame seed error', error.message);
  }

  console.log('Seeding mobile_cases...');
  const cases = [
    { title: 'Couple Custom Case', tag: 'Sweet Hearts', price: 299, image_url: '/__l5e/assets-v1/placeholder-couple/case-couple.png', sort_order: 10 },
    { title: 'Family Custom Case', tag: 'Tamil Quote', price: 299, image_url: '/__l5e/assets-v1/placeholder-family/case-family.png', sort_order: 20 },
  ];
  for (const c of cases) {
    const { error } = await supabase.from('mobile_cases').upsert(c, { onConflict: 'title' });
    if (error) console.error('Mobile case seed error', error.message);
  }

  // create owner admin if not exists
  const ownerEmail = 'rithishsekar421@gmail.com';
  console.log('Ensuring admin user exists:', ownerEmail);
    // Check auth.users via the internal auth schema
    const { data: list, error: userErr } = await supabase.from('auth.users').select('id,email').ilike('email', ownerEmail).limit(1);
    if (userErr) {
      console.warn('Could not query auth.users directly (requires service role key).', userErr.message);
    } else if (!list || list.length === 0) {
      console.log('Owner account not found in auth.users; create via Supabase auth sign up in client flow.');
    } else {
      const ownerId = list[0].id;
      const { error } = await supabase.from('user_roles').upsert({ user_id: ownerId, role: 'admin' }, { onConflict: ['user_id','role'] });
      if (error) console.error('Failed to assign admin role:', error.message);
      else console.log('Assigned admin role to owner id', ownerId);
    }

  console.log('Seed complete');
}

main().catch((err) => { console.error(err); process.exit(1); });
