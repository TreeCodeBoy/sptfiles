"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceManager = void 0;
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class InstanceManager {
    //#region Accessible in or after preAkiLoad
    alpha = false;
    version = "";
    // Instances
    container;
    preSptModLoader;
    configServer;
    saveServer;
    itemHelper;
    logger;
    staticRouter;
    vfs;
    hashUtil;
    httpResponseUtil;
    //#endregion
    //#region Acceessible in or after postDBLoad
    database;
    customItem;
    imageRouter;
    jsonUtil;
    profileHelper;
    ragfairPriceService;
    importerUtil;
    customItemService;
    mailSendService;
    traderHelper;
    //#endregion
    // Call at the start of the mods postDBLoad method
    preSptLoad(container) {
        this.container = container;
        this.preSptModLoader = container.resolve("PreSptModLoader");
        this.imageRouter = container.resolve("ImageRouter");
        this.configServer = container.resolve("ConfigServer");
        this.saveServer = container.resolve("SaveServer");
        this.itemHelper = container.resolve("ItemHelper");
        this.logger = container.resolve("WinstonLogger");
        this.staticRouter = container.resolve("StaticRouterModService");
        this.vfs = container.resolve("VFS");
        this.hashUtil = container.resolve("HashUtil");
        this.httpResponseUtil = container.resolve("HttpResponseUtil");
    }
    postDBLoad(container) {
        this.database = container.resolve("DatabaseServer").getTables();
        this.customItem = container.resolve("CustomItemService");
        this.jsonUtil = container.resolve("JsonUtil");
        this.profileHelper = container.resolve("ProfileHelper");
        this.ragfairPriceService = container.resolve("RagfairPriceService");
        this.importerUtil = container.resolve("ImporterUtil");
        this.customItemService = container.resolve("CustomItemService");
        this.mailSendService = container.resolve("MailSendService");
        this.traderHelper = container.resolve("TraderHelper");
        if (this.alpha) {
            this.displayAlphaWarning();
        }
    }
    displayAlphaWarning() {
        const logger = this.logger;
        logger.logWithColor("===================================================================================", LogTextColor_1.LogTextColor.RED);
        logger.logWithColor(`Skills Extended: RC Build. Version: ${this.version ?? "None"}`, LogTextColor_1.LogTextColor.RED);
        logger.logWithColor("Do not ask for support running this on your game. This is not an error.", LogTextColor_1.LogTextColor.RED);
        logger.logWithColor("Expect nothing to work. Report what doesn't. Everything is subject to change.", LogTextColor_1.LogTextColor.RED);
        logger.logWithColor("===================================================================================", LogTextColor_1.LogTextColor.RED);
    }
}
exports.InstanceManager = InstanceManager;
//# sourceMappingURL=InstanceManager.js.map