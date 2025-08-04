# Assets Directory

This directory contains static assets for the ACF Mastery mobile app.

## Required Assets

You'll need to add the following assets for the app to work properly:

### App Icons
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon foreground
- `favicon.png` (48x48) - Web favicon

### Splash Screen
- `splash.png` (1284x2778) - iOS splash screen image

## Asset Guidelines

### App Icon (`icon.png`)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Design: Should work well at small sizes
- Brand: Include ACF Mastery branding elements

### Splash Screen (`splash.png`)
- Size: 1284x2778 pixels (iPhone 14 Pro resolution)
- Format: PNG
- Background: Use primary brand color (#2563eb)
- Content: App logo and name centered

### Adaptive Icon (`adaptive-icon.png`)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe area: Keep important elements in center 66% circle
- Background: Will be masked on Android

## Creating Assets

You can create these assets using:
- Design tools: Figma, Sketch, Adobe Illustrator
- Online generators: App icon generators
- AI tools: DALL-E, Midjourney for initial concepts

## Example Structure
```
assets/
├── icon.png
├── adaptive-icon.png
├── splash.png
├── favicon.png
└── README.md
```

## Notes
- All assets should follow iOS Human Interface Guidelines
- Test icons at various sizes to ensure readability
- Consider light/dark mode compatibility
- Optimize file sizes for faster app loading