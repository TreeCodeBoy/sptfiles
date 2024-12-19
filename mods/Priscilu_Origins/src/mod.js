"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
// New trader settings
const baseJson = require("../db/base.json");
const assortJson = require("../db/assort.json");
//import dialogues = require("../db/dialogues.json");
const traderHelpers_1 = require("./traderHelpers");
class Priscilu_Origins {
    mod;
    logger;
    traderHelper;
    constructor() {
        this.mod = "Priscilu_Origins"; // Set name of mod so we can log it to console later - match this to your folder name that's built for \user\mods\
    }
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    preSptLoad(container) {
        // Get a logger
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preSpt Loading... `);
        // Get SPT code/data we need later
        const preSptModLoader = container.resolve("PreSptModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new traderHelpers_1.TraderHelper();
        this.traderHelper.registerProfileImage(baseJson, this.mod, preSptModLoader, imageRouter, "Priscilu_Origins.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);
        //        this.traderHelper.addDialogues
        // Add trader to trader enum
        Traders_1.Traders[baseJson._id] = baseJson._id;
        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] preSpt Loaded`);
    }
    /**
     * Majority of trader-related work occurs after the spt database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        // Resolve SPT classes we'll use
        const databaseServer = container.resolve("DatabaseServer");
        const jsonUtil = container.resolve("JsonUtil");
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        // Add new trader to the trader dictionary in DatabaseServer - this is where the assort json is loaded
        /*
        * The assortJSON includes the following:
        * Milk available for roubles at LL1
        * Milk available for item barter at LL1
        * Helmet w/ soft armour available for roubles at LL1
        * Helmet w/ soft armour available for item barter at LL1
        *
        * It is *highly recommended* to use MongoIDs for the IDs in the assort, this example does not in order to make it easier to understand.
        */
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil, assortJson);
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Priscilu_Origins", baseJson.nickname, baseJson.location, "A distinguished gunsmith who smuggles some of the best weapons and equipment into Tarkov. Also, he is excellent in repairing weapons and armor, and now he offers the best and the fastest insurance service in Tarkov.");
        //        this.traderHelper.addDialogues(baseJson, dialogues, tables);
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}
exports.mod = new Priscilu_Origins();
//# sourceMappingURL=mod.js.map