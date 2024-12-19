export interface IModConfig {
    recoil: {
        verticalMultiplier: number;
        horizontalMultiplier: number;
        dispersionMultiplier: number;
        cameraMultiplier: number;
        convergenceMultiplier: number;
    };
    aiming: {
        swayIntensity: number;
        aimStability: number;
        ergonomicsMultiplier: number;
        mouseSensitivity: number;
    };
}