import config from "./config";
import { IModConfig } from "./types/IModConfig";

interface IContainer {
    resolve(name: string): any;
}

interface ILogger {
    info(message: string): void;
}

interface IDatabaseServer {
    getTables(): {
        templates: {
            items: Record<string, IItem>;
        };
        globals: {
            config: IGlobalConfig;
        };
    };
}

interface IProfileHelper {
    getPmcProfile(): {
        Inventory?: {
            items: Array<{
                _tpl: string;
            }>;
        };
    };
}

interface IItem {
    _props: {
        RecoilForceUp?: number;
        RecoilForceBack?: number;
        CameraRecoil?: number;
        Convergence?: number;
        RecoilDispersion?: number;
        Ergonomics?: number;
        AimSway?: number;
    };
}

interface IGlobalConfig {
    Aiming?: {
        AimProceduralIntensity?: number;
        AimingSpeedMultiplier?: number;
        WeaponStability?: number; // Added for aimStability support
    };
}

class RecoilStandalone {
    private readonly modName: string;

    constructor() {
        this.modName = "RecoilStandalone";
    }

    private calculateEffect(value: number): string {
        if (value < 1) {
            return `${Math.round((1 - value) * 100)}% reduction`;
        } else if (value > 1) {
            return `${Math.round((value - 1) * 100)}% increase`;
        }
        return "Default value";
    }

    private validateConfig(config: IModConfig): void {
        const validateRange = (value: number, name: string): void => {
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

    private modifyWeaponProps(props: IItem["_props"], config: IModConfig, isPlayerWeapon: boolean): void {
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

    private modifyGlobalSettings(globals: IGlobalConfig, config: IModConfig): void {
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

    public postDBLoad(container: IContainer): void {
        try {
            // Validate config before applying changes
            this.validateConfig(config);

            const logger = container.resolve("WinstonLogger") as ILogger;
            const databaseServer = container.resolve("DatabaseServer") as IDatabaseServer;
            const tables = databaseServer.getTables();

            // Get player profile
            const profileHelper = container.resolve("ProfileHelper") as IProfileHelper;
            const playerProfile = profileHelper.getPmcProfile();
            const playerItems = new Set<string>();

            // Get list of player's weapon IDs
            if (playerProfile?.Inventory?.items) {
                playerProfile.Inventory.items.forEach(item => {
                    playerItems.add(item._tpl);
                });
            }

            // Modify weapons
            Object.values(tables.templates.items).forEach(item => {
                const isPlayerWeapon = playerItems.has(item._props?.RecoilForceUp);
                this.modifyWeaponProps(item._props, config, isPlayerWeapon);
            });

            // Modify global settings (these only affect player)
            this.modifyGlobalSettings(tables.globals.config, config);

            logger.info(`${this.modName}: Successfully applied modifications to player weapons only`);
        } catch (error) {
            const logger = container.resolve("WinstonLogger") as ILogger;
            logger.info(`${this.modName}: Error applying modifications: ${error.message}`);
        }
    }
}

export = { mod: new RecoilStandalone() };