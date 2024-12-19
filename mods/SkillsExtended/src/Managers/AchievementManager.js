"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementManager = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class AchievementManager {
    InstanceManager;
    IOManager;
    postDbLoad(instanceManager, ioManager) {
        this.InstanceManager = instanceManager;
        this.IOManager = ioManager;
        this.importAchievementData();
    }
    importAchievementData() {
        const dataPath = this.IOManager.AchievementsRootPath;
        const files = fs_1.default.readdirSync(dataPath);
        const jsonFiles = files
            .filter(file => node_path_1.default.extname(file) === ".json")
            .map(file => node_path_1.default.basename(file, ".json"));
        const achievmentTable = this.InstanceManager.database.templates.achievements;
        let loadedAchievements = 0;
        for (const file of jsonFiles) {
            const filePath = node_path_1.default.resolve(dataPath, `${file}.json`);
            const data = this.IOManager.loadJsonFile(filePath);
            for (const achievement of data) {
                achievmentTable.push(achievement);
            }
            loadedAchievements += data.length;
        }
        this.InstanceManager.logger
            .logWithColor(`Skills Extended: Loaded ${loadedAchievements} achievements`, LogTextColor_1.LogTextColor.GREEN);
    }
}
exports.AchievementManager = AchievementManager;
//# sourceMappingURL=AchievementManager.js.map