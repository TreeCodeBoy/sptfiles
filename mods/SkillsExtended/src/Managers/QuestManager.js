"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestManager = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class QuestManager {
    InstanceManager;
    IOManager;
    postDbLoad(instanceManager, ioManager) {
        this.InstanceManager = instanceManager;
        this.IOManager = ioManager;
        this.importQuests();
    }
    importQuests() {
        const dataPath = this.IOManager.QuestsRootPath;
        const files = fs_1.default.readdirSync(dataPath);
        const jsonFiles = files
            .filter(file => node_path_1.default.extname(file) === ".json")
            .map(file => node_path_1.default.basename(file, ".json"));
        const questTable = this.InstanceManager.database.templates.quests;
        let loadedQuests = 0;
        for (const file of jsonFiles) {
            const filePath = node_path_1.default.resolve(dataPath, `${file}.json`);
            const data = this.IOManager.loadJsonFile(filePath);
            for (const quest of data) {
                questTable[quest._id] = quest;
            }
            loadedQuests += data.length;
        }
        this.InstanceManager.logger
            .logWithColor(`Skills Extended: Loaded ${loadedQuests} quests`, LogTextColor_1.LogTextColor.GREEN);
    }
}
exports.QuestManager = QuestManager;
//# sourceMappingURL=QuestManager.js.map