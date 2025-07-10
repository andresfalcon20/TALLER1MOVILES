import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://pebjrpnqabblhdnswcqz.supabase.co',
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlYmpycG5xYWJibGhkbnN3Y3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODMxNzUsImV4cCI6MjA2NzY1OTE3NX0.nHdTK3aS9PKuYSiP9x9R9A3l04-e5hQxSeJiOqn5rnc')