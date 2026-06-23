// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dolztiarbrgxodnbvhob.supabase.co'; 
const supabaseKey = 'sb_publishable_ywFMPb3UmiAVgOGeRziyEw_jfjWXUF1';

export const supabase = createClient(supabaseUrl, supabaseKey);