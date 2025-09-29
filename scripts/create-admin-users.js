import { createClient } from '@supabase/supabase-js'

// Admin user creation script
// Run this script to create admin and counselor accounts

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY' // Service role key!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUsers() {
  const adminUsers = [
    {
      email: 'admin@wellnessspace.com',
      password: 'AdminPass123!',
      role: 'super_admin',
      display_name: 'System Administrator'
    },
    {
      email: 'dr.ananya@wellnessspace.com',
      password: 'CounselorPass123!',
      role: 'counselor',
      display_name: 'Dr. Ananya Sharma'
    },
    {
      email: 'dr.rajesh@wellnessspace.com',
      password: 'CounselorPass123!',
      role: 'counselor',
      display_name: 'Dr. Rajesh Kumar'
    }
  ]

  for (const user of adminUsers) {
    try {
      // Create user account
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      })

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError)
        continue
      }

      console.log(`✅ Created user: ${user.email}`)

      // Update profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: user.role,
          display_name: user.display_name
        })
        .eq('user_id', authUser.user.id)

      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError)
      } else {
        console.log(`✅ Updated role for ${user.email}: ${user.role}`)
      }

    } catch (error) {
      console.error(`Error processing ${user.email}:`, error)
    }
  }
}

// Run the script
createAdminUsers()
  .then(() => {
    console.log('✅ Admin user creation completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error creating admin users:', error)
    process.exit(1)
  })