"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOManager = void 0;
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const json5_1 = __importDefault(require("C:/snapshot/project/node_modules/json5"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class IOManager {
    constructor(instanceManager) {
        this.InstanceManager = instanceManager;
    }
    InstanceManager;
    ServerConfig;
    RootPath = node_path_1.default.join(node_path_1.default.dirname(__filename), "..", "..");
    DataPath = node_path_1.default.join(this.RootPath, "data");
    ConfigPath = node_path_1.default.join(this.RootPath, "config");
    ProgressPath = node_path_1.default.join(this.RootPath, "progression");
    AchievementsRootPath = node_path_1.default.join(this.DataPath, "Achievements");
    AssortRootPath = node_path_1.default.join(this.DataPath, "Assort");
    CustomQuestConditions = node_path_1.default.join(this.DataPath, "CustomQuestConditions");
    LocaleRootPath = node_path_1.default.join(this.DataPath, "Locales");
    TraderRootPath = node_path_1.default.join(this.DataPath, "Trader");
    QuestsRootPath = node_path_1.default.join(this.DataPath, "Quests");
    ImageRootPath = node_path_1.default.join(this.DataPath, "Images");
    ItemRootPath = node_path_1.default.join(this.DataPath, "Items");
    preSptLoad() {
        const confPath = node_path_1.default.join(this.ConfigPath, "ServerConfig.json");
        this.ServerConfig = this.loadJsonFile(confPath);
    }
    importData() {
        this.importAllLocaleData();
        this.importAllImages();
    }
    /**
     * Loads and parses a config file from disk
     * @param fileName File name inside of config folder to load
     */
    loadJsonFile(filePath, readAsText = false) {
        const file = node_path_1.default.join(filePath);
        const string = this.InstanceManager.vfs.readFile(file);
        return readAsText
            ? string
            : json5_1.default.parse(string);
    }
    saveProgressionFile(progressFile, fileName) {
        const progPath = node_path_1.default.join(this.ProgressPath, fileName);
        const jsonData = JSON.stringify(progressFile, null, 2);
        fs_1.default.writeFileSync(progPath, jsonData, "utf8");
        this.InstanceManager.logger
            .logWithColor(`Skills Extended: Progression file for ${progressFile.Id} saved.`, LogTextColor_1.LogTextColor.GREEN);
    }
    /**
     * Loads a locale file from disk
     */
    loadLocaleFile(filePath) {
        try {
            const data = fs_1.default.readFileSync(filePath, "utf-8");
            const jsonData = json5_1.default.parse(data); // Cast to desired type
            return jsonData;
        }
        catch (error) {
            throw new Error("Failed to load dictionary");
        }
    }
    importAllLocaleData() {
        const localesPath = this.LocaleRootPath;
        const subDirs = fs_1.default.readdirSync(localesPath);
        for (const lang of subDirs) {
            const langDir = node_path_1.default.join(localesPath, lang);
            const localeFiles = fs_1.default.readdirSync(langDir);
            const logger = this.InstanceManager.logger;
            let entries = 0;
            for (const file of localeFiles) {
                const localeData = this.loadJsonFile(node_path_1.default.join(langDir, file));
                entries += this.importLocaleData(lang, localeData);
            }
            if (entries === 0)
                continue;
            logger.logWithColor(`Skills Extended: Loaded ${entries} locale entries for locale '${lang}'`, LogTextColor_1.LogTextColor.GREEN);
        }
        this.importMissingLocalesAsEnglish();
    }
    importLocaleData(lang, localeData) {
        const globals = this.InstanceManager.database.locales.global;
        for (const entry in localeData) {
            globals[lang][entry] = localeData[entry];
        }
        return Object.keys(localeData).length;
    }
    importMissingLocalesAsEnglish() {
        const globals = this.InstanceManager.database.locales.global;
        const logger = this.InstanceManager.logger;
        let count = 0;
        for (const entry in globals.en) {
            for (const lang in globals) {
                if (globals[lang][entry] === undefined) {
                    globals[lang][entry] = globals.en[entry];
                    count++;
                }
            }
        }
        logger.logWithColor(`Skills Extended: Defaulted ${count} locale entries to english across ${Object.keys(globals).length} languages.`, LogTextColor_1.LogTextColor.YELLOW);
        logger.logWithColor("Skills Extended: If you would like to provide translations, please reach out on the mod page.", LogTextColor_1.LogTextColor.YELLOW);
    }
    importAllImages() {
        const imageRouter = this.InstanceManager.imageRouter;
        const logger = this.InstanceManager.logger;
        const directories = [
            node_path_1.default.join(this.ImageRootPath, "Achievements"),
            node_path_1.default.join(this.ImageRootPath, "Quests"),
            node_path_1.default.join(this.ImageRootPath, "Trader")
        ];
        let images = 0;
        for (const directory of directories) {
            const files = fs_1.default.readdirSync(directory);
            for (const image of files) {
                const imagePath = node_path_1.default.join(directory, image);
                const filenameWithoutExtension = node_path_1.default.basename(imagePath, node_path_1.default.extname(imagePath));
                if (imagePath.includes("Trader")) {
                    imageRouter.addRoute(`/files/trader/avatar/${filenameWithoutExtension}`, imagePath);
                    images++;
                    continue;
                }
                if (imagePath.includes("Achivements")) {
                    imageRouter.addRoute(`/files/achievement/${filenameWithoutExtension}`, imagePath);
                    images++;
                    continue;
                }
                if (imagePath.includes("Quests")) {
                    imageRouter.addRoute(`/files/quest/icon/${filenameWithoutExtension}`, imagePath);
                    images++;
                }
            }
        }
        logger.logWithColor(`Skills Extended: Loaded ${images} images`, LogTextColor_1.LogTextColor.GREEN);
    }
}
exports.IOManager = IOManager;
//# sourceMappingURL=IOManager.js.map