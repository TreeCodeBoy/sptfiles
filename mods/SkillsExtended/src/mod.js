"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceManager_1 = require("./Managers/InstanceManager");
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const ProgressionManager_1 = require("./Managers/ProgressionManager");
const IOManager_1 = require("./Managers/IOManager");
const RouteManager_1 = require("./Managers/RouteManager");
const AchievementManager_1 = require("./Managers/AchievementManager");
const TraderManager_1 = require("./Managers/TraderManager");
const QuestManager_1 = require("./Managers/QuestManager");
const SkillsExtendedIds_1 = require("./enums/SkillsExtendedIds");
class SkillsExtended {
    InstanceManager = new InstanceManager_1.InstanceManager();
    IOManager = new IOManager_1.IOManager(this.InstanceManager);
    ProgressionManager = new ProgressionManager_1.ProgressionManager();
    AchievementManager = new AchievementManager_1.AchievementManager();
    TraderManager = new TraderManager_1.TraderManager();
    QuestManager = new QuestManager_1.QuestManager();
    RouteManager = new RouteManager_1.RouteManager();
    customItemService;
    SkillsConfig;
    preSptLoad(container) {
        this.InstanceManager.preSptLoad(container);
        this.IOManager.preSptLoad();
        this.SkillsConfig = this.IOManager.loadJsonFile(node_path_1.default.join(this.IOManager.ConfigPath, "SkillsConfig.json5"));
        this.RouteManager.preSptLoad(this.InstanceManager, this.ProgressionManager, this.SkillsConfig, this.IOManager);
        this.TraderManager.preSptLoad(this.InstanceManager, this.IOManager, this.SkillsConfig);
        this.InstanceManager.logger.logWithColor("Skills Extended loading", LogTextColor_1.LogTextColor.GREEN);
    }
    postDBLoad(container) {
        this.InstanceManager.postDBLoad(container);
        this.ProgressionManager.init(this.InstanceManager, this.IOManager);
        this.customItemService = this.InstanceManager.customItemService;
        this.AchievementManager.postDbLoad(this.InstanceManager, this.IOManager);
        this.TraderManager.postDbLoad();
        this.QuestManager.postDbLoad(this.InstanceManager, this.IOManager);
        this.addCraftsToDatabase();
        this.CreateItems();
        // Do this after so we dont wipe locales with create items
        this.IOManager.importData();
        this.addItemToSpecSlots(SkillsExtendedIds_1.SkillsExtendedIds.Lockpick);
        this.addItemToSpecSlots(SkillsExtendedIds_1.SkillsExtendedIds.Pda);
    }
    CreateItems() {
        const items = this.IOManager.loadJsonFile(node_path_1.default.join(this.IOManager.ItemRootPath, "Items.json"));
        for (const item of items) {
            this.customItemService.createItemFromClone(item);
        }
        this.InstanceManager.logger.logWithColor(`Skills Extended: Loaded ${items.length} custom items`, LogTextColor_1.LogTextColor.GREEN);
    }
    addCraftsToDatabase() {
        const crafts = this.SkillsConfig.LockPicking.CRAFTING_RECIPES;
        for (const craft of crafts) {
            this.InstanceManager.database.hideout.production.recipes.push(craft);
        }
    }
    addItemToSpecSlots(itemId) {
        // Allow in spec slot
        const items = this.InstanceManager.database.templates.items;
        for (const item in items) {
            const id = items[item]._id;
            if (id !== "627a4e6b255f7527fb05a0f6" && id !== "65e080be269cbd5c5005e529")
                continue;
            items[item]._props.Slots[0]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[1]._props.filters[0].Filter.push(itemId);
            items[item]._props.Slots[2]._props.filters[0].Filter.push(itemId);
        }
    }
}
module.exports = { mod: new SkillsExtended() };
//# sourceMappingURL=mod.js.map