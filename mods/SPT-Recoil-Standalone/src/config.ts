import { IModConfig } from "./types/IModConfig";

const config: IModConfig = {
    // Recoil Settings
    // These settings control how weapons behave when firing
    recoil: {
        // Controls vertical weapon climb when firing
        // Default: 1.0 (100% normal recoil)
        // Example values:
        // - 0.2 = Very low recoil (80% reduction), good for new players
        // - 0.4 = Moderate recoil (60% reduction), balanced gameplay
        // - 0.8 = Challenging recoil (20% reduction), more realistic
        // - 1.5 = High recoil (50% increase), hardcore difficulty
        verticalMultiplier: 0.4,

        // Controls horizontal weapon movement when firing
        // Default: 1.0 (100% normal side-to-side movement)
        // Example values:
        // - 0.3 = Very stable sideways (70% reduction), easier to control
        // - 0.4 = Reduced spread (60% reduction), good for mid-range
        // - 0.7 = Light reduction (30% reduction), challenging but fair
        // - 1.2 = Increased spread (20% increase), more randomness
        horizontalMultiplier: 0.4,

        // Controls bullet spread pattern
        // Default: 1.0 (100% normal spread)
        // Example values:
        // - 0.2 = Laser-like accuracy (80% tighter grouping)
        // - 0.4 = Improved accuracy (60% tighter grouping)
        // - 0.8 = Slight improvement (20% tighter grouping)
        // - 1.3 = Wider spread (30% more spread), shotgun-like
        dispersionMultiplier: 0.4,

        // Controls visual camera shake when firing
        // Default: 1.0 (100% normal shake)
        // Example values:
        // - 0.2 = Minimal shake, easier to track targets
        // - 0.4 = Reduced shake, good for full-auto
        // - 0.7 = Moderate shake, more immersive
        // - 1.2 = Increased shake, more challenging
        cameraMultiplier: 0.4,

        // Controls how quickly weapon returns to center after recoil
        // Default: 1.0 (100% normal return speed)
        // Example values:
        // - 0.7 = Slower return, requires more recoil control
        // - 1.0 = Default return speed
        // - 1.3 = Faster return, easier to control bursts
        // - 1.5 = Very fast return, good for tap-firing
        convergenceMultiplier: 1.0
    },

    // Aiming Settings
    // These settings affect weapon handling while aiming down sights
    aiming: {
        // Controls weapon sway while aiming
        // Default: 1.0 (100% normal sway)
        // Example values:
        // - 0.2 = Very steady aim (80% reduction)
        // - 0.4 = Stable aim (60% reduction)
        // - 0.8 = Light sway (20% reduction)
        // - 1.2 = Increased sway (20% increase)
        swayIntensity: 0.4,

        // Controls general aiming stability and weapon steadiness
        // Default: 1.0 (100% normal stability)
        // Example values:
        // - 0.8 = Less stable, more challenging
        // - 1.0 = Default stability
        // - 1.2 = Increased stability
        // - 1.5 = Very stable, easier to hold aim
        aimStability: 1.0,

        // Affects weapon handling speed and ADS time
        // Default: 1.0 (100% normal ergonomics)
        // Example values:
        // - 0.8 = Slower handling, more realistic
        // - 1.0 = Default handling speed
        // - 1.2 = Faster handling
        // - 1.5 = Very fast handling, arcade-style
        ergonomicsMultiplier: 1.0,

        // Affects mouse sensitivity while aiming
        // Default: 1.0 (100% normal sensitivity)
        // Example values:
        // - 0.8 = Lower sensitivity, better precision
        // - 1.0 = Default sensitivity
        // - 1.2 = Higher sensitivity, faster target acquisition
        // - 1.5 = Very high sensitivity
        mouseSensitivity: 1.0
    }
};

/* Common Preset Examples:

1. New Player Friendly:
    recoil: {
        verticalMultiplier: 0.2,    // Very low recoil
        horizontalMultiplier: 0.2,   // Very stable
        dispersionMultiplier: 0.3,   // Accurate
        cameraMultiplier: 0.2,       // Minimal shake
        convergenceMultiplier: 1.3    // Fast center return
    },
    aiming: {
        swayIntensity: 0.2,          // Very steady
        aimStability: 1.3,           // Very stable
        ergonomicsMultiplier: 1.2,   // Fast handling
        mouseSensitivity: 1.0        // Normal sensitivity
    }

2. Balanced Experience:
    recoil: {
        verticalMultiplier: 0.4,     // Moderate recoil
        horizontalMultiplier: 0.4,    // Moderate stability
        dispersionMultiplier: 0.4,    // Improved accuracy
        cameraMultiplier: 0.4,        // Reduced shake
        convergenceMultiplier: 1.0     // Normal return
    },
    aiming: {
        swayIntensity: 0.4,          // Stable aim
        aimStability: 1.0,           // Normal stability
        ergonomicsMultiplier: 1.0,   // Normal handling
        mouseSensitivity: 1.0        // Normal sensitivity
    }

3. Hardcore/Realistic:
    recoil: {
        verticalMultiplier: 0.8,     // Significant recoil
        horizontalMultiplier: 0.8,    // More spread
        dispersionMultiplier: 0.8,    // More bullet spread
        cameraMultiplier: 0.7,        // Notable shake
        convergenceMultiplier: 0.8     // Slower return
    },
    aiming: {
        swayIntensity: 0.8,          // More sway
        aimStability: 0.9,           // Less stability
        ergonomicsMultiplier: 0.9,   // Slower handling
        mouseSensitivity: 0.9        // Lower sensitivity
    }
*/

export default config;