"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderManager = void 0;
const node_path_1 = __importDefault(require("node:path"));
const InstanceManager_1 = require("./InstanceManager");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const SkillsExtendedIds_1 = require("../enums/SkillsExtendedIds");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class TraderManager {
    InstanceManager = new InstanceManager_1.InstanceManager();
    IOManager;
    SkillsConfig;
    TraderConfig;
    RagfairConfig;
    BaseJson;
    preSptLoad(instanceManager, iOManager, skillsConfig) {
        this.InstanceManager = instanceManager;
        this.IOManager = iOManager;
        this.SkillsConfig = skillsConfig;
        if (!this.IOManager.ServerConfig.EnableTrader)
            return;
        this.TraderConfig = instanceManager.configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        this.RagfairConfig = instanceManager.configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        this.BaseJson = this.IOManager.loadJsonFile(node_path_1.default.join(this.IOManager.TraderRootPath, "base.json"));
        // Add to traders enum and enable on ragfair
        Traders_1.Traders[this.BaseJson._id] = this.BaseJson._id;
        this.RagfairConfig.traders[this.BaseJson._id] = true;
        this.registerProfileImage();
        this.setTraderUpdateTime();
    }
    postDbLoad() {
        if (!this.IOManager.ServerConfig.EnableTrader) {
            this.InstanceManager.logger.logWithColor("Skills Extended: Trader Disabled.", LogTextColor_1.LogTextColor.BLUE);
            this.loadLockPickingItemsIfDisabled();
            return;
        }
        this.addTraderToDb();
        this.addTraderToLocales();
    }
    registerProfileImage() {
        const imageRouter = this.InstanceManager.imageRouter;
        // Reference the mod "res" folder
        const imageFilepath = node_path_1.default.join(this.IOManager.ImageRootPath, "Trader", "66bf1f65e1f3b83ea069a271.jpg");
        // Register a route to point to the profile picture - remember to remove the .jpg from it
        imageRouter.addRoute(this.BaseJson.avatar.replace(".jpg", ""), imageFilepath);
    }
    setTraderUpdateTime() {
        // Add refresh time in seconds to config
        const traderRefreshRecord = {
            traderId: this.BaseJson._id,
            seconds: {
                min: 1800,
                max: 3600
            },
        };
        this.TraderConfig.updateTime.push(traderRefreshRecord);
    }
    addTraderToDb() {
        const database = this.InstanceManager.database;
        const ioMgr = this.IOManager;
        const questAssort = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "QuestAssort.json"));
        // Add trader to trader table, key is the traders id
        database.traders[this.BaseJson._id] = {
            assort: this.createAssortTable(),
            base: this.BaseJson,
            questassort: questAssort
        };
    }
    /**
     * Create basic data for trader + add empty assorts table for trader
     * @returns ITraderAssort
     */
    createAssortTable() {
        const ioMgr = this.IOManager;
        const items = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "Items.json"));
        const barterScheme = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "BarterScheme.json"));
        const loyalLevelItems = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "LoyalLevelItems.json"));
        // Create a blank assort object, ready to have items added
        const assortTable = {
            nextResupply: 0,
            items: items,
            barter_scheme: barterScheme,
            loyal_level_items: loyalLevelItems
        };
        return assortTable;
    }
    loadLockPickingItemsIfDisabled() {
        if (!this.SkillsConfig.LockPicking.ENABLED)
            return;
        const ioMgr = this.IOManager;
        const items = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "Items.json"));
        const barterScheme = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "BarterScheme.json"));
        const loyalLevelItems = ioMgr.loadJsonFile(node_path_1.default.join(ioMgr.AssortRootPath, "LoyalLevelItems.json"));
        const mechanicAssort = this.InstanceManager.database.traders[Traders_1.Traders.MECHANIC].assort;
        const peaceKeeperAssort = this.InstanceManager.database.traders[Traders_1.Traders.PEACEKEEPER].assort;
        for (const item of items) {
            const id = item._id;
            const scheme = barterScheme[id];
            const loyal = loyalLevelItems[id];
            if (item._tpl === SkillsExtendedIds_1.SkillsExtendedIds.Lockpick) {
                mechanicAssort.items.push(item);
                mechanicAssort.barter_scheme[id] = scheme;
                mechanicAssort.loyal_level_items[id] = loyal;
            }
            if (item._tpl === SkillsExtendedIds_1.SkillsExtendedIds.Pda) {
                console.log(`Adding PeaceKeeper ${item._tpl}`);
                peaceKeeperAssort.items.push(item);
                peaceKeeperAssort.barter_scheme[id] = scheme;
                peaceKeeperAssort.loyal_level_items[id] = loyal;
            }
        }
    }
    addTraderToLocales() {
        const global = this.InstanceManager.database.locales.global;
        // For each language, add locale for the new trader
        const locales = Object.values(global);
        for (const locale of locales) {
            locale[`${this.BaseJson._id} FullName`] = "Scholars Society";
            locale[`${this.BaseJson._id} FirstName`] = "Scholars Society";
            locale[`${this.BaseJson._id} Nickname`] = "Scholars Society";
            locale[`${this.BaseJson._id} Location`] = "Undisclosed";
            locale[`${this.BaseJson._id} Description`] = "From the outside, Scholars Society appears to be a haven for bookworms, its shelves lined with an eclectic collection of titles. However, beneath the facade lies a secret: a discreet operation dealing in high-quality weaponry for high-end mercenaries.";
        }
    }
}
exports.TraderManager = TraderManager;
//# sourceMappingURL=TraderManager.js.map