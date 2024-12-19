"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("./config"));
class RecoilStandalone {
    modName;
    constructor() {
        this.modName = "RecoilStandalone";
    }
    calculateEffect(value) {
        if (value < 1) {
            return `${Math.round((1 - value) * 100)}% reduction`;
        }
        else if (value > 1) {
            return `${Math.round((value - 1) * 100)}% increase`;
        }
        return "Default value";
    }
    validateConfig(config) {
        const validateRange = (value, name) => {
            if (value <= 0) {
                throw new Error(`${name} must be greater than 0`);
            }
        };
        // Validate recoil settings
        Object.entries(config.recoil).forEach(([key, value]) => {
            validateRange(value, `Recoil ${key}`);
        });
        // Validate aiming settings
        Object.entries(config.aiming).forEach(([key, value]) => {
            validateRange(value, `Aiming ${key}`);
        });
    }
    modifyWeaponProps(props, config, isPlayerWeapon) {
        if (isPlayerWeapon && props.RecoilForceUp !== undefined) {
            props.RecoilForceUp *= config.recoil.verticalMultiplier;
            if (props.RecoilForceBack !== undefined) {
                props.RecoilForceBack *= config.recoil.horizontalMultiplier;
            }
            if (props.CameraRecoil !== undefined && props.CameraRecoil > 0) {
                props.CameraRecoil *= config.recoil.cameraMultiplier;
            }
            if (props.Convergence !== undefined) {
                props.Convergence *= config.recoil.convergenceMultiplier;
            }
            if (props.RecoilDispersion !== undefined) {
                props.RecoilDispersion *= config.recoil.dispersionMultiplier;
            }
            if (props.Ergonomics !== undefined) {
                props.Ergonomics *= config.aiming.ergonomicsMultiplier;
            }
            if (props.AimSway !== undefined) {
                props.AimSway *= config.aiming.swayIntensity;
            }
        }
    }
    modifyGlobalSettings(globals, config) {
        if (globals.Aiming) {
            if (globals.Aiming.AimProceduralIntensity !== undefined) {
                globals.Aiming.AimProceduralIntensity *= config.aiming.swayIntensity;
            }
            if (globals.Aiming.AimingSpeedMultiplier !== undefined) {
                globals.Aiming.AimingSpeedMultiplier *= config.aiming.mouseSensitivity;
            }
            // Apply aimStability to weapon stability
            if (globals.Aiming.WeaponStability !== undefined) {
                globals.Aiming.WeaponStability *= config.aiming.aimStability;
            }
        }
    }
    postDBLoad(container) {
        try {
            // Validate config before applying changes
            this.validateConfig(config_1.default);
            const logger = container.resolve("WinstonLogger");
            const databaseServer = container.resolve("DatabaseServer");
            const tables = databaseServer.getTables();
            // Get player profile
            const profileHelper = container.resolve("ProfileHelper");
            const playerProfile = profileHelper.getPmcProfile();
            const playerItems = new Set();
            // Get list of player's weapon IDs
            if (playerProfile?.Inventory?.items) {
                playerProfile.Inventory.items.forEach(item => {
                    playerItems.add(item._tpl);
                });
            }
            // Modify weapons
            Object.values(tables.templates.items).forEach(item => {
                const isPlayerWeapon = playerItems.has(item._props?.RecoilForceUp);
                this.modifyWeaponProps(item._props, config_1.default, isPlayerWeapon);
            });
            // Modify global settings (these only affect player)
            this.modifyGlobalSettings(tables.globals.config, config_1.default);
            logger.info(`${this.modName}: Successfully applied modifications to player weapons only`);
        }
        catch (error) {
            const logger = container.resolve("WinstonLogger");
            logger.info(`${this.modName}: Error applying modifications: ${error.message}`);
        }
    }
}
module.exports = { mod: new RecoilStandalone() };
//# sourceMappingURL=mod.js.map