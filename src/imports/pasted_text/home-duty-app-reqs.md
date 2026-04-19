 Full Frontend Requirements — Home Duty App                                    
                                                                                
  ---                                                                           
  Tech Stack                                                                    
            
  - Framework: Next.js (Pages Router) + TypeScript                              
  - Styling: CSS Modules немесе Tailwind CSS — dark theme                       
  - State: React hooks (useState, useEffect, useContext)                        
  - Real-time: WebSocket немесе Server-Sent Events (SSE)                        
  - PWA: Service Worker + Web Manifest                                          
  - HTTP: fetch wrapper (cookie-based JWT auth)                                 
                                                                                
  ---                                                                           
  Pages & Routes                                                                
                                                            
  ┌─────────────┬───────────────────────┬──────────┐
  │    Route    │         Page          │   Auth   │                            
  ├─────────────┼───────────────────────┼──────────┤
  │ /login      │ Login                 │ Public   │                            
  ├─────────────┼───────────────────────┼──────────┤        
  │ /signup                 │ Sign Up               │ Public   │
  ├─────────────────────────┼───────────────────────┼──────────┤
  │ /forgot                 │ Forgot Password       │ Public   │
  ├─────────────────────────┼───────────────────────┼──────────┤                
  │ /reset                  │ Reset Password        │ Public     │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /dashboard              │ Today's duties + feed │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /calendar               │ Monthly calendar      │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /day/[date]             │ Single day detail     │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤
  │ /messages               │ Real-time chat        │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /profile                │ User profile          │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /settings               │ Settings hub          │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤
  │ /settings/notifications │ Push prefs            │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /settings/telegram      │ Telegram link         │ Required   │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /settings/rotations     │ Rotation config       │ Admin only │
  ├─────────────────────────┼───────────────────────┼────────────┤              
  │ /settings/members       │ Member manage         │ Admin only │
  └─────────────────────────┴───────────────────────┴────────────┘              
                                                            
  ---
  1. Auth Pages
                                                                                
  Login (/login)
  - Email + password inputs                                                     
  - Show/hide password toggle                               
  - "Forgot password?" link → /forgot
  - "No account? Sign up" link → /signup
  - Loading state on submit                                                     
  - Error alert on failure 
  - Redirect to /dashboard on success                                           
                                                            
  Sign Up (/signup)                                                             
  - Fields: Full name, Email, Password, Invite code                             
  - Inline validation (email format, password ≥ 8 chars)
  - Error: invite code invalid / email taken                                    
  - Redirect to /dashboard on success                       
                                                                                
  Forgot Password (/forgot)
  - Email input → sends reset link                                              
  - Success state: "Check your inbox"                                           
   
  Reset Password (/reset?token=...)                                             
  - New password + confirm password                         
  - Token invalid → error state                                                 
                                                            
  ---                                                                           
  2. Dashboard (/dashboard)
                                                                                
  Header                                                    
  - Today's date (formatted)
  - Logged-in user's name + role badge if admin                                 
   
  Duty Cards                                                                    
  - One card per duty: label, assigned user's avatar + name, status badge
  - pending → blue badge, done → green badge + timestamp                        
  - "Mark done" button — only visible on own assigned duty, disabled while
  loading                                                                       
  - Empty state: "No duties today 🎉"                                           
                                                                                
  Activity Feed                                                                 
  - Section title: "Today's activity"                       
  - Feed items in reverse chronological order:                                  
    - Note: 📝 icon, text, author, time, edit/delete (own)  
    - Photo: 🖼 icon, image, caption, author, time, comment count badge,         
  edit/delete (own)                                                             
    - Check-in: ✅ icon, text, author, time, delete (own)                       
  - Add note: textarea (auto-expand) + "Add note" button                        
  - Check-in: single button "✅ Check in"                                       
  - Upload photo:                                                               
    - "📷 Upload photo" button → file picker (image/*)                          
    - Optional caption input                                                    
    - "Upload as check-in" option                                               
    - Upload progress indicator                                                 
                                                                                
  ---                                                                           
  3. Comments (under photos)
                                                                                
  Comment section — expandable below each photo card        
  - Toggle: "💬 3 comments" → expands list                                      
  - Comment list:                                                               
    - Avatar + name + text + relative time ("2 min ago")                        
    - Delete button for own comments                                            
  - New comment form at the bottom:                                             
    - Single-line input + "Send" button (or Enter)                              
    - Disabled while submitting                                                 
  - Real-time: new comments appear without page refresh                         
                                                                                
  ---                                                                           
  4. Calendar (/calendar)                                   
                                                                                
  - react-day-picker monthly calendar                       
  - Day modifiers:                                                              
    - Blue outline → has note
    - Bottom shadow → has photo                                                 
    - Green tint → has check-in                             
  - Click day → navigate to /day/[date]                                         
  - Month navigation arrows                                                     
  - Legend: Note / Photo / Check-in                                             
                                                                                
  Day Detail (/day/[date])                                                      
  - Back button                                             
  - Full DayFeed for selected date (same as dashboard feed)                     
                                                            
  ---                                                                           
  5. Real-Time Messaging (/messages)
                                                                                
  Conversation list (left panel on desktop, full screen on mobile)
  - List of all household members                                               
  - Last message preview + unread count badge               
  - Sorted by latest message                                                    
                                                                                
  Chat screen (right panel on desktop, full screen on mobile)
  - Header: other user's avatar + name                                          
  - Message bubbles:                                        
    - Own messages: right-aligned, primary color background                     
    - Others: left-aligned, muted background                                    
    - Timestamp below each message (time only)                                  
    - Date separator between days                                               
  - Auto-scroll to bottom on new message                                        
  - Input bar (fixed at bottom):                            
    - Text input (multiline, grows up to 4 lines)                               
    - Send button (disabled if empty)                       
    - Enter to send, Shift+Enter for newline                                    
  - Real-time: WebSocket or SSE — no refresh needed                             
  - Unread badge on nav tab                                                     
                                                                                
  ---                                                                           
  6. Profile (/profile)                                                         
                                                                                
  Avatar section                                            
  - Current avatar displayed (120×120, circle)                                  
  - If no custom avatar: show selected default avatar
  - "Change photo" button → opens picker:                                       
    - Upload custom: file input (image/*, max 5MB)                              
    - Choose default: grid of 8 preset avatars to pick                          
  - Upload progress + preview before confirm                                    
                                                                                
  Info section                                                                  
  - Display name (read-only)                                
  - Nickname — inline edit (pencil icon → input → save)                         
  - Email (read-only)                                       
                                                                                
  Change password                                           
  - Collapsible section                                                         
  - Fields: Current password, New password, Confirm new password                
  - Save button, success/error feedback                         
                                                                                
  Connected services                                                            
  - Telegram: status chip (linked ✅ / not linked) + link button
  - Push notifications: on/off toggle                                           
                                                            
  ---                                                                           
  7. Settings (/settings)                                   
                                                                                
  Hub page — list of navigation cards:
  - 🔔 Notifications → /settings/notifications                                  
  - ✈️  Telegram → /settings/telegram                                            
  - 🔄 Rotations (admin only) → /settings/rotations
  - 👥 Members (admin only) → /settings/members                                 
                                                                                
  Each card: icon + title + description + › arrow
                                                                                
  ---                                                       
  8. Navigation                                                                 
                                                            
  Desktop — top navigation bar:
  - Logo / app name left                                                        
  - Links: Dashboard, Calendar, Messages, Profile
  - Settings icon right                                                         
                                                                                
  Mobile — fixed bottom tab bar (PWA):
                                                                                
  ┌──────────┬──────┬──────────────┐                        
  │   Tab    │ Icon │    Badge     │                                            
  ├──────────┼──────┼──────────────┤                        
  │ Home     │ 🏠   │ —            │
  ├──────────┼──────┼──────────────┤
  │ Calendar │ 📅   │ —            │                                            
  ├──────────┼──────┼──────────────┤
  │ Messages │ 💬   │ unread count │                                            
  ├──────────┼──────┼──────────────┤                        
  │ Profile  │ 👤   │ —            │
  └──────────┴──────┴──────────────┘

  Active tab highlighted. Safe-area padding for iOS home indicator.             
   
  ---                                                                           
  9. Shared Components                                      

  ┌──────────────────┬─────────────────────────────────────────────────────┐
  │    Component     │                     Description                     │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Avatar           │ Circle image, fallback to initials, sizes: sm/md/lg │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Badge            │ Pill label with color variants                      │    
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Button           │ Primary / secondary / danger, loading state         │    
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Input / Textarea │ Dark-styled, focus ring, 16px font (no iOS zoom)    │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Card             │ Frosted glass panel with border                     │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Toast            │ Auto-dismiss notification (success / error / info)  │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Spinner          │ Inline + full-screen loading                        │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ AlertError       │ Red error box                                       │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ Modal            │ Centered overlay with backdrop blur                 │
  ├──────────────────┼─────────────────────────────────────────────────────┤    
  │ BottomSheet      │ Mobile-native slide-up panel                        │
  └──────────────────┴─────────────────────────────────────────────────────┘    
                                                            
  ---                                                                           
  10. Global UX Requirements                                
                            
  - Dark theme only — #0b1220 background, white text
  - Mobile-first — all pages usable at 375px width                              
  - PWA:                                                                        
    - Web App Manifest with icons (192×192, 512×512 maskable)                   
    - Service Worker: cache static assets offline                               
    - "Add to Home Screen" prompt                                               
  - Touch targets — minimum 44×44px                                             
  - iOS safe area — env(safe-area-inset-*) padding                              
  - Input font-size: 16px — prevents iOS auto-zoom                              
  - Loading states — every API call shows feedback                              
  - Optimistic updates — mark done / send message feel instant                  
  - Error recovery — retry button on failed requests                            
  - Accessibility — semantic HTML, alt text on images, keyboard nav             
                                                                                
  ---                                                                           
  11. API Integration Notes                                                     
                                                            
  ┌───────────────┬───────────────────────────────────┐
  │     Action      │             Endpoint              │
  ├─────────────────┼───────────────────────────────────┤
  │ Login           │ POST /api/v1/auth/login           │
  ├─────────────────┼───────────────────────────────────┤
  │ Me              │ GET /api/v1/me                        │                   
  ├─────────────────┼───────────────────────────────────────┤
  │ Today duties    │ GET /api/v1/today                     │                   
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Mark done       │ POST /api/v1/assignments/:id/done     │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Day feed        │ GET /api/day/:date                    │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Add entry       │ POST /api/day/:date                   │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Upload file     │ POST /api/upload                      │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Update avatar   │ PATCH /api/v1/me/avatar               │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Update nickname │ PATCH /api/v1/me/nickname             │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Messages        │ GET/POST /api/v1/messages/:userId     │
  ├─────────────────┼───────────────────────────────────────┤                   
  │ Comments        │ GET/POST /api/v1/entries/:id/comments │
  └─────────────────┴───────────────────────────────────────┘                   
   
  Auth: JWT in HttpOnly cookie — sent automatically with every request. No      
  Authorization header needed.                              
                                                                                
✻ Crunched for 1m 26s                                       
                                                                              
────────────────────────────────────────────────────────────────────────────────
❯  
────────────────────────────────────────────────────────────────────────────────
  ⏵⏵ accept edits on (shift+tab to cycle)
                                                                                
                                                                                


