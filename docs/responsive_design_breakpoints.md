# Responsive Design Breakpoints

## Device Coverage

### 📱 iPhones (390px - 480px)
- **Devices**: iPhone 14, iPhone 16 Pro, iPhone 17 Pro Max
- **Breakpoint**: `@media(max-width: 480px)`
- **Modal**: Full screen (92vh), single column, 300px image height
- **Product Grid**: Single column (1fr)
- **Features**: 
  - Rounded modal corners (24px top)
  - 38px navigation buttons
  - Full-width cart drawer
  - Optimized touch targets (minimum 38px)

### 📱 iPad & Large Phones (481px - 768px)
- **Devices**: iPad Mini, iPhone Plus models, large Android phones
- **Breakpoint**: `@media(max-width: 768px)`
- **Modal**: 92vw x 85vh, single column, 340px image height
- **Product Grid**: Single column with 260px minimum
- **Features**:
  - Mobile navigation enabled
  - 42px buttons
  - Adjusted spacing for touch

### 📱 iPad 11" (834px - 900px)
- **Devices**: iPad Air 11", iPad Pro 11"
- **Breakpoint**: `@media(min-width:834px) and (max-width:900px)`
- **Modal**: 85vw, two-column (360px + 1fr), 400px image height
- **Product Grid**: Auto-fill with 240px minimum
- **Features**:
  - Optimized for horizontal and vertical orientations
  - Balanced layout for medium screens

### 💻 iPad Pro & Small Laptops (769px - 1024px)
- **Devices**: iPad Pro 12.9", iPad Pro 13", MacBook Air 13", laptops 13-14"
- **Breakpoint**: `@media(max-width:1024px)`
- **Modal**: 90vw x 88vh, two-column (420px + 1fr), 380px image height
- **Product Grid**: Auto-fill with 280px minimum
- **Features**:
  - Desktop-like layout with responsive scaling
  - 44px buttons
  - Optimal for both tablet and laptop use

### 💻 Standard Laptops (1025px - 1399px)
- **Devices**: MacBook Pro 14", 15" laptops, standard desktop monitors
- **Default Styles** (no media query)
- **Modal**: 900px x 85vh, two-column (420px + 1fr), 520px image height
- **Product Grid**: Auto-fill with 300px minimum
- **Features**:
  - Full desktop experience
  - 48px buttons
  - Maximum usability and visual appeal

### 💻 Large Laptops & Desktops (1400px+)
- **Devices**: MacBook Pro 16", 24" monitors, 27" iMacs
- **Breakpoint**: `@media(min-width:1400px)`
- **Modal**: 960px x 85vh, two-column (440px + 1fr), 540px image height
- **Product Grid**: Auto-fill with 300px minimum
- **Features**:
  - Enhanced modal size for large screens
  - More comfortable viewing distances
  - Premium desktop experience

## Key Responsive Features

### Product Cards
- **All devices**: 1:1 aspect ratio images (square)
- **Consistent sizing**: `padding-bottom: 100%` technique
- **Hover effects**: Maintained on desktop, tap-friendly on mobile

### Product Modal
- **Navigation**: Arrow buttons and zoom icon on all devices
- **Lightbox**: Full-screen image view available everywhere
- **Scrolling**: Ingredients section scrollable when content exceeds viewport
- **ESC key**: Closes lightbox first, then modal
- **Touch**: Optimized button sizes for touch devices (38px+)

### Cart Drawer
- **Desktop**: 400px fixed width from right
- **Tablet**: 360px width
- **Mobile**: Full screen (100% width)

### Header & Navigation
- **Desktop (>768px)**: Horizontal navigation bar
- **Mobile (≤768px)**: Hamburger menu with slide-out drawer

## Testing Checklist

- [x] iPhone 14 (390x844) - @media(max-width:480px)
- [x] iPhone 16 Pro (402x874) - @media(max-width:480px)
- [x] iPhone 17 Pro Max (430x932) - @media(max-width:480px)
- [x] iPad 11" (834x1194) - @media(min-width:834px) and (max-width:900px)
- [x] iPad Pro 12.9" (1024x1366) - @media(max-width:1024px)
- [x] iPad Pro 13" (1032x1376) - @media(max-width:1024px)
- [x] MacBook Air 13" (1280x800) - Default styles
- [x] MacBook Pro 14" (1512x982) - @media(min-width:1400px)
- [x] MacBook Pro 16" (1728x1117) - @media(min-width:1400px)

## Performance Optimizations

- **Lazy loading**: Images load on scroll
- **CSS Grid**: Hardware accelerated layouts
- **Minimal JavaScript**: Most responsive behavior handled by CSS
- **Touch-first**: Button sizes and spacing optimized for fingers
- **Viewport units**: Ensures proper scaling across all devices
