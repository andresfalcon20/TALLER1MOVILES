import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://bnisancsodgroaudqrts.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaXNhbmNzb2Rncm9hdWRxcnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTk3MzgsImV4cCI6MjA2Nzc3NTczOH0.Nz6CZD6x6FCarlF-QoOLdc8v9-yUkOVRfawNfPqwlco')