import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const khauId = 'a4eba12d-3c14-4e28-842f-f1b1cf151b20';
  const { data: rels } = await supabase
    .from('relationships')
    .select('*, person_a_obj:person_a(id, full_name, generation), person_b_obj:person_b(id, full_name, generation)')
    .or(`person_a.eq.${khauId},person_b.eq.${khauId}`);
  console.log('Kháu rels:', rels?.map(r => `${r.type}: ${r.person_a_obj?.full_name} -> ${r.person_b_obj?.full_name}`));

  const canh3Keywords = ['Kháu', 'Thành', 'Pháo', 'Qué', 'Quế', 'Chò', 'Hảo', 'Duệ', 'Hải', 'Hà', 'Hợp', 'Hiệp', 'Lý', 'Vân', 'Thanh Sơn'];
  const { data: allPersons } = await supabase
    .from('persons')
    .select('id, full_name, generation, birth_order, is_in_law')
    .eq('family_id', 'a5eeaa60-c4e7-40f5-a867-91c17fe6a3c1');
  const matched = allPersons.filter(p => canh3Keywords.some(k => p.full_name && p.full_name.includes(k)));
  console.log('Matched keywords count:', matched.length);
  matched.forEach(p => console.log(p.id, '|', p.full_name, '| Gen:', p.generation, '| InLaw:', p.is_in_law));
}
run();
