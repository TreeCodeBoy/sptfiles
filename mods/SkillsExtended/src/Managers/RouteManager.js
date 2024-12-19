"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const SkillsExtendedIds_1 = require("../enums/SkillsExtendedIds");
class RouteManager {
    InstanceManager;
    ProgressionManager;
    SkillsConfig;
    IOManager;
    preSptLoad(instanceManager, progressionManager, skillsConfig, ioManager) {
        this.InstanceManager = instanceManager;
        this.ProgressionManager = progressionManager;
        this.SkillsConfig = skillsConfig;
        this.IOManager = ioManager;
        this.registerRoutes();
    }
    registerRoutes() {
        const staticRouter = this.InstanceManager.staticRouter;
        staticRouter.registerStaticRouter("GetSkillsConfig", [
            {
                url: "/skillsExtended/GetSkillsConfig",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    this.ProgressionManager.getActivePmcData(sessionId);
                    const addWeaponsPath = node_path_1.default.join(this.IOManager.ConfigPath, "AdditionalWeapons.json");
                    if (this.InstanceManager.vfs.exists(addWeaponsPath)) {
                        const weapons = this.IOManager.loadJsonFile(addWeaponsPath);
                        this.SkillsConfig.EasternRifle.WEAPONS.push(...weapons.AdditionalEasternWeapons);
                        this.SkillsConfig.NatoRifle.WEAPONS.push(...weapons.AdditionalNatoWeapons);
                        const logger = this.InstanceManager.logger;
                        logger.logWithColor("Skills Extended: Found and loaded additional weapons", LogTextColor_1.LogTextColor.GREEN);
                    }
                    return JSON.stringify(this.SkillsConfig, null, 2);
                }
            }
        ], "");
        staticRouter.registerStaticRouter("GetKeys", [
            {
                url: "/skillsExtended/GetKeys",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    return this.getKeys();
                }
            }
        ], "");
        staticRouter.registerStaticRouter("end", [
            {
                url: "/client/match/offline/end",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    this.ProgressionManager.checkForPendingRewards();
                    return output;
                }
            }
        ], "");
        staticRouter.registerStaticRouter("select", [
            {
                url: "/client/game/profile/select",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    this.ProgressionManager.checkForPendingRewards();
                    return output;
                }
            }
        ], "");
        staticRouter.registerStaticRouter("AddSkillSideList", [
            {
                url: "/client/game/profile/list",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    const http = this.InstanceManager.httpResponseUtil;
                    const profile = this.addSkillSideFieldToProfile(sessionId);
                    //profile = this.addMissingSkillsToProfile(sessionId, profile);
                    return profile !== undefined
                        ? http.getBody(profile)
                        : output;
                }
            }
        ], "");
        staticRouter.registerStaticRouter("AddSkillSideInfo", [
            {
                url: "/launcher/profile/info",
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                action: async (url, info, sessionId, output) => {
                    this.addSkillSideFieldToProfile(sessionId);
                    return output;
                }
            }
        ], "");
    }
    getKeys() {
        const items = Object.values(this.InstanceManager.database.templates.items);
        const locale = this.InstanceManager.database.locales.global["en"];
        const keys = {
            keyLocale: {}
        };
        const itemHelper = this.InstanceManager.itemHelper;
        const keyItems = items.filter(x => x._type === "Item"
            && itemHelper.isOfBaseclasses(x._id, [BaseClasses_1.BaseClasses.KEY, BaseClasses_1.BaseClasses.KEY_MECHANICAL, BaseClasses_1.BaseClasses.KEYCARD]));
        for (const item of keyItems) {
            keys.keyLocale[item._id] = locale[`${item._id} Name`];
        }
        return JSON.stringify(keys);
    }
    /**
     * Fixes a BSG bug by adding the correct side field to the skill manager
     * @param sessionId
     */
    addSkillSideFieldToProfile(sessionId) {
        const helper = this.InstanceManager.profileHelper;
        const saveServer = this.InstanceManager.saveServer;
        if (saveServer.getProfile(sessionId).info.wipe)
            return;
        const pmcProfile = helper.getPmcProfile(sessionId);
        const scavProfile = helper.getScavProfile(sessionId);
        const pmcSide = pmcProfile?.Info?.Side ?? "Bear";
        const pmcSkills = pmcProfile?.Skills;
        const scavSkills = scavProfile?.Skills;
        if (!pmcSkills || !scavSkills)
            return;
        pmcSkills.Side = pmcSide;
        pmcSkills.IsPlayer = true;
        scavSkills.Side = "Savage";
        scavSkills.IsPlayer = true;
        const profile = [];
        profile.push(pmcProfile);
        profile.push(scavProfile);
        return profile;
    }
    addMissingSkillsToProfile(sessionId, profile) {
        const saveServer = this.InstanceManager.saveServer;
        if (saveServer.getProfile(sessionId).info.wipe)
            return profile;
        const pmcSkills = profile[0]?.Skills?.Common;
        const scavSkills = profile[1]?.Skills?.Common;
        if (!pmcSkills || !scavSkills)
            return profile;
        for (const newSkill in SkillsExtendedIds_1.NewSkills) {
            console.log(`Adding new skill ${newSkill}`);
            if (pmcSkills.find(x => x.Id === newSkill))
                continue;
            const common = {
                Id: newSkill,
                PointsEarnedDuringSession: 0,
                LastAccess: 0,
                Progress: 0
            };
            pmcSkills.push(common);
            scavSkills.push(common);
        }
        return profile;
    }
}
exports.RouteManager = RouteManager;
//# sourceMappingURL=RouteManager.js.map