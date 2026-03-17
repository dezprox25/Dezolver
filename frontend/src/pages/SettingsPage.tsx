// import { useSettingsStore } from '@store/settingsStore'
// import ThemeToggle from '@components/settings/ThemeToggle'
// import { useAuthStore } from '@store/authStore'
// import { config } from '@/config'

// const SettingsPage = () => {
//   const { user } = useAuthStore()
//   const {
//     fontSize,
//     codeEditorTheme,
//     autoSave,
//     notifications,
//     soundEffects,
//     compactMode,
//     setFontSize,
//     setCodeEditorTheme,
//     setAutoSave,
//     setNotifications,
//     setSoundEffects,
//     setCompactMode,
//     resetToDefaults,
//   } = useSettingsStore()

//   const handleReset = () => {
//     if (confirm('Are you sure you want to reset all settings to default values?')) {
//       resetToDefaults()
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
//         <p className="text-muted-foreground">
//           Customize your {config.app.name} experience and preferences.
//         </p>
//       </div>

//       <div className="space-y-8">
//         {/* Appearance Section */}
//         <div className="bg-card text-card-foreground rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <span className="mr-2">🎨</span>
//             Appearance
//           </h2>

//           <div className="space-y-6">
//             {/* Theme Toggle */}
//             {/* <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Theme</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Choose your preferred color theme
//                 </p>
//               </div>
//               <ThemeToggle />
//             </div> */}

//             {/* Font Size */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Font Size</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Adjust text size throughout the application
//                 </p>
//               </div>
//               <select
//                 value={fontSize}
//                 onChange={(e) => setFontSize(e.target.value as any)}
//                 className="input w-32"
//               >
//                 <option value="small">Small</option>
//                 <option value="medium">Medium</option>
//                 <option value="large">Large</option>
//               </select>
//             </div>

//             {/* Compact Mode */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Compact Mode</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Reduce padding and spacing for more content density
//                 </p>
//               </div>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={compactMode}
//                   onChange={(e) => setCompactMode(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${compactMode ? 'bg-primary' : 'bg-muted'
//                   }`}>
//                   <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${compactMode ? 'translate-x-6' : 'translate-x-1'
//                     }`} />
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Code Editor Section */}
//         <div className="bg-card text-card-foreground rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <span className="mr-2">⌨️</span>
//             Code Editor
//           </h2>

//           <div className="space-y-6">
//             {/* Editor Theme */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Editor Theme</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Choose the code editor appearance
//                 </p>
//               </div>
//               <select
//                 value={codeEditorTheme}
//                 onChange={(e) => setCodeEditorTheme(e.target.value as any)}
//                 className="input w-40"
//               >
//                 <option value="vs-light">VS Light</option>
//                 <option value="vs-dark">VS Dark</option>
//                 <option value="github-light">GitHub Light</option>
//                 <option value="github-dark">GitHub Dark</option>
//               </select>
//             </div>

//             {/* Auto Save */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Auto Save</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Automatically save your code while typing
//                 </p>
//               </div>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={autoSave}
//                   onChange={(e) => setAutoSave(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSave ? 'bg-primary' : 'bg-muted'
//                   }`}>
//                   <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'
//                     }`} />
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Notifications Section */}
//         <div className="bg-card text-card-foreground rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <span className="mr-2">🔔</span>
//             Notifications
//           </h2>

//           <div className="space-y-6">
//             {/* Notifications */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Browser Notifications</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Receive notifications for contests, submissions, and updates
//                 </p>
//               </div>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={notifications}
//                   onChange={(e) => setNotifications(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-muted'
//                   }`}>
//                   <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
//                     }`} />
//                 </div>
//               </label>
//             </div>

//             {/* Sound Effects */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-medium text-foreground">Sound Effects</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Play sounds for successful submissions and achievements
//                 </p>
//               </div>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={soundEffects}
//                   onChange={(e) => setSoundEffects(e.target.checked)}
//                   className="sr-only"
//                 />
//                 <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEffects ? 'bg-primary' : 'bg-muted'
//                   }`}>
//                   <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${soundEffects ? 'translate-x-6' : 'translate-x-1'
//                     }`} />
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Account Section */}
//         {user && (
//           <div className="bg-card text-card-foreground rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-6 flex items-center">
//               <span className="mr-2">👤</span>
//               Account
//             </h2>

//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1">
//                     Username
//                   </label>
//                   <div className="input bg-muted text-muted-foreground cursor-not-allowed">
//                     {user.username}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1">
//                     Email
//                   </label>
//                   <div className="input bg-muted text-muted-foreground cursor-not-allowed">
//                     {user.email}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1">
//                     Rating
//                   </label>
//                   <div className="input bg-muted text-muted-foreground cursor-not-allowed">
//                     {user.rating || 1200}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1">
//                     Role
//                   </label>
//                   <div className="input bg-muted text-muted-foreground cursor-not-allowed">
//                     {user.role}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Reset Section */}
//         <div className="bg-card text-card-foreground rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-6 flex items-center">
//             <span className="mr-2">🔄</span>
//             Reset Settings
//           </h2>

//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-medium text-foreground">Reset to Defaults</h3>
//               <p className="text-sm text-muted-foreground">
//                 Restore all settings to their default values
//               </p>
//             </div>
//             <button
//               onClick={handleReset}
//               className="btn btn-outline text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2"
//             >
//               Reset Settings
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SettingsPage

import { useState } from 'react'
import { useSettingsStore } from '@store/settingsStore'
import ThemeToggle from '@components/settings/ThemeToggle'
import { useAuthStore } from '@store/authStore'
import { config } from '@/config'

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuthStore()
  const {
    fontSize,
    codeEditorTheme,
    autoSave,
    notifications,
    soundEffects,
    compactMode,
    setFontSize,
    setCodeEditorTheme,
    setAutoSave,
    setNotifications,
    setSoundEffects,
    setCompactMode,
    resetToDefaults,
  } = useSettingsStore()

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  
  // User/Student profile state
  const [editedUserProfile, setEditedUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    collegeName: user?.collegeName || '',
    registerNumber: user?.registerNumber || '',
    mobileNumber: user?.mobileNumber || '',
    officialEmail: user?.officialEmail || '',
    district: user?.district || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  })

  // Manager profile state
  const [editedManagerProfile, setEditedManagerProfile] = useState({
    email: user?.email || '',
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
  })

  // Admin profile state
  const [editedAdminProfile, setEditedAdminProfile] = useState({
    collegeName: user?.collegeName || '',
    departmentName: user?.departmentName || '',
    hodName: user?.hodName || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
    address: user?.address || '',
  })

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      resetToDefaults()
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original values if canceling
      if (user?.role === 'user') {
        setEditedUserProfile({
          name: user?.name || '',
          email: user?.email || '',
          collegeName: user?.collegeName || '',
          registerNumber: user?.registerNumber || '',
          mobileNumber: user?.mobileNumber || '',
          officialEmail: user?.officialEmail || '',
          district: user?.district || '',
          state: user?.state || '',
          pincode: user?.pincode || '',
        })
      } else if (user?.role === 'manager') {
        setEditedManagerProfile({
          email: user?.email || '',
          fullName: user?.fullName || '',
          phoneNumber: user?.phoneNumber || '',
        })
      } else if (user?.role === 'admin') {
        setEditedAdminProfile({
          collegeName: user?.collegeName || '',
          departmentName: user?.departmentName || '',
          hodName: user?.hodName || '',
          mobileNumber: user?.mobileNumber || '',
          email: user?.email || '',
          address: user?.address || '',
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    try {
      let profileData
      if (user?.role === 'user') {
        profileData = editedUserProfile
      } else if (user?.role === 'manager') {
        profileData = editedManagerProfile
      } else if (user?.role === 'admin') {
        profileData = editedAdminProfile
      }
      
      await updateUserProfile(profileData)
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleUserInputChange = (field: string, value: string) => {
    setEditedUserProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleManagerInputChange = (field: string, value: string) => {
    setEditedManagerProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAdminInputChange = (field: string, value: string) => {
    setEditedAdminProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your {config.app.name} experience and preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">🎨</span>
            Appearance
          </h2>

          <div className="space-y-6">
            {/* Font Size */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Font Size</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust text size throughout the application
                </p>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as any)}
                className="input w-32"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Compact Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce padding and spacing for more content density
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  compactMode ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">⌨️</span>
            Code Editor
          </h2>

          <div className="space-y-6">
            {/* Editor Theme */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Editor Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the code editor appearance
                </p>
              </div>
              <select
                value={codeEditorTheme}
                onChange={(e) => setCodeEditorTheme(e.target.value as any)}
                className="input w-40"
              >
                <option value="vs-light">VS Light</option>
                <option value="vs-dark">VS Dark</option>
                <option value="github-light">GitHub Light</option>
                <option value="github-dark">GitHub Dark</option>
              </select>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Auto Save</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically save your code while typing
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoSave ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">🔔</span>
            Notifications
          </h2>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Browser Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for contests, submissions, and updates
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">
                  Play sounds for successful submissions and achievements
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEffects ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    soundEffects ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Section */}
        {user && (
          <div className="bg-card text-card-foreground rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <span className="mr-2">👤</span>
                Account Details
              </h2>
              {/* Show edit button for user, manager, and admin */}
              {(user.role === 'user' || user.role === 'manager' || user.role === 'admin') && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="btn btn-primary px-4 py-2"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="btn btn-outline px-4 py-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="btn btn-outline px-4 py-2"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* USER ROLE - Student Profile */}
              {user.role === 'user' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Student Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.name}
                        onChange={(e) => handleUserInputChange('name', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUserProfile.email}
                        onChange={(e) => handleUserInputChange('email', e.target.value)}
                        className="input w-full"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* College Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      College Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.collegeName}
                        onChange={(e) => handleUserInputChange('collegeName', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your college name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.collegeName || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Register Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Register Number <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.registerNumber}
                        onChange={(e) => handleUserInputChange('registerNumber', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your register number"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.registerNumber || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUserProfile.mobileNumber}
                        onChange={(e) => handleUserInputChange('mobileNumber', e.target.value)}
                        className="input w-full"
                        placeholder="+91 1234567890"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.mobileNumber || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Official Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Official Email <span className="text-muted-foreground text-xs">(Optional)</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUserProfile.officialEmail}
                        onChange={(e) => handleUserInputChange('officialEmail', e.target.value)}
                        className="input w-full"
                        placeholder="official.email@college.edu"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.officialEmail || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      District <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.district}
                        onChange={(e) => handleUserInputChange('district', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your district"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.district || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      State <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.state}
                        onChange={(e) => handleUserInputChange('state', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your state"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.state || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Pincode <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUserProfile.pincode}
                        onChange={(e) => handleUserInputChange('pincode', e.target.value)}
                        className="input w-full"
                        placeholder="600001"
                        maxLength={6}
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.pincode || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Username - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Username
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.username}
                    </div>
                  </div>

                  {/* Rating - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Rating
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.rating || 1200}
                    </div>
                  </div>

                  {/* Role - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Role
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.role}
                    </div>
                  </div>
                </div>
              )}

              {/* MANAGER ROLE */}
              {user.role === 'manager' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Username
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.username}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedManagerProfile.email}
                        onChange={(e) => handleManagerInputChange('email', e.target.value)}
                        className="input w-full"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedManagerProfile.fullName}
                        onChange={(e) => handleManagerInputChange('fullName', e.target.value)}
                        className="input w-full"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.fullName || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedManagerProfile.phoneNumber}
                        onChange={(e) => handleManagerInputChange('phoneNumber', e.target.value)}
                        className="input w-full"
                        placeholder="+91 1234567890"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.phoneNumber || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ADMIN ROLE */}
              {user.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* College Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      College Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedAdminProfile.collegeName}
                        onChange={(e) => handleAdminInputChange('collegeName', e.target.value)}
                        className="input w-full"
                        placeholder="Enter college name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.collegeName || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Department Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Department Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedAdminProfile.departmentName}
                        onChange={(e) => handleAdminInputChange('departmentName', e.target.value)}
                        className="input w-full"
                        placeholder="Enter department name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.departmentName || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* HOD/Admin Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      HOD / Admin Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedAdminProfile.hodName}
                        onChange={(e) => handleAdminInputChange('hodName', e.target.value)}
                        className="input w-full"
                        placeholder="Enter HOD/Admin name"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.hodName || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Username - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Username
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.username}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedAdminProfile.mobileNumber}
                        onChange={(e) => handleAdminInputChange('mobileNumber', e.target.value)}
                        className="input w-full"
                        placeholder="+91 1234567890"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.mobileNumber || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedAdminProfile.email}
                        onChange={(e) => handleAdminInputChange('email', e.target.value)}
                        className="input w-full"
                        placeholder="admin@college.edu"
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Address <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedAdminProfile.address}
                        onChange={(e) => handleAdminInputChange('address', e.target.value)}
                        className="input w-full"
                        placeholder="Enter full address"
                        rows={3}
                      />
                    ) : (
                      <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                        {user.address || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUPER ADMIN ROLE */}
              {user.role === 'super_admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Username - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Username
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.username}
                    </div>
                  </div>

                  {/* Email - Read only */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <div className="input bg-muted text-muted-foreground cursor-not-allowed">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

              {/* Password Change Section - Available for all roles */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <button
                  onClick={() => {/* Implement password change modal/route */}}
                  className="btn btn-outline px-4 py-2"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Section */}
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">🔄</span>
            Reset Settings
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Reset to Defaults</h3>
              <p className="text-sm text-muted-foreground">
                Restore all settings to their default values
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-outline text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage