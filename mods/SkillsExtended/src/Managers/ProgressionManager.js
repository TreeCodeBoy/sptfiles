"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionManager = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const MessageType_1 = require("C:/snapshot/project/obj/models/enums/MessageType");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
class ProgressionManager {
    InstanceManager;
    IOManager;
    logger;
    PmcProfile;
    Progression;
    SkillRewards;
    ServerConfig;
    init(instanceManager, ioManager) {
        this.InstanceManager = instanceManager;
        this.IOManager = ioManager;
        this.logger = instanceManager.logger;
        this.ServerConfig = ioManager.ServerConfig;
        this.SkillRewards = this.IOManager.loadJsonFile(node_path_1.default.join(this.IOManager.ConfigPath, "SkillRewards.json"));
        this.debugTestGeneration();
    }
    getActivePmcData(sessionId) {
        if (!this.ServerConfig.EnableProgression)
            return;
        this.PmcProfile = this.InstanceManager.profileHelper.getPmcProfile(sessionId);
        this.checkForOrCreateProgressFile();
    }
    wipeProgressFile(sessionId) {
        if (!this.ServerConfig.EnableProgression)
            return;
        this.PmcProfile = this.InstanceManager.profileHelper.getPmcProfile(sessionId);
        if (!this.checkForOrCreateProgressFile()) {
            this.Progression.Progress = {};
            this.logger.logWithColor(`Skills Extended: Progress file for ${this.PmcProfile.Info.Nickname} wiped.`, LogTextColor_1.LogTextColor.YELLOW);
            this.IOManager.saveProgressionFile(this.Progression, `${this.PmcProfile._id}.json`);
        }
    }
    debugTestGeneration() {
        if (this.ServerConfig.ProgressionDebug.Enabled && this.ServerConfig.ProgressionDebug.TestGeneration) {
            const runs = this.ServerConfig.ProgressionDebug.NumberOfRuns;
            const level = this.ServerConfig.ProgressionDebug.GenerationLevel;
            for (let i = 0; i < runs; i++) {
                this.generateReward(level, true);
            }
        }
    }
    checkForOrCreateProgressFile() {
        const progPath = node_path_1.default.join(this.IOManager.ProgressPath, `${this.PmcProfile._id}.json`);
        if (!this.InstanceManager.vfs.exists(progPath)) {
            this.logger.logWithColor(`Skills Extended: Progress file for ${this.PmcProfile._id} does not exist.`, LogTextColor_1.LogTextColor.YELLOW);
            this.logger.logWithColor("Skills Extended: This is normal, creating a new one now.", LogTextColor_1.LogTextColor.YELLOW);
            this.Progression = {
                Id: this.PmcProfile._id,
                Progress: {}
            };
            this.IOManager.saveProgressionFile(this.Progression, `${this.PmcProfile._id}.json`);
            return true;
        }
        this.Progression = this.IOManager.loadJsonFile(progPath);
        this.logger.logWithColor(`Skills Extended: Progress file for ${this.Progression.Id} loaded.`, LogTextColor_1.LogTextColor.GREEN);
        return false;
    }
    checkForPendingRewards() {
        if (!this.ServerConfig.EnableProgression)
            return;
        if (this.PmcProfile?.Skills?.Common === undefined) {
            this.logger.logWithColor("Skills Extended: No skills defined on profile, this is normal on new or wiped profiles.", LogTextColor_1.LogTextColor.YELLOW);
            return;
        }
        this.logger.logWithColor(`Skills Extended: Checking for pending rewards for ${this.Progression.Id}`, LogTextColor_1.LogTextColor.CYAN);
        const skills = this.PmcProfile.Skills.Common;
        for (const skill of skills) {
            if (skill.Progress === 0)
                continue;
            const tier = this.convertSkillProgressToRewardTier(skill.Progress);
            const rewardDiff = this.findDifferenceInRewardLevel(skill.Id, tier);
            if (rewardDiff > 0) {
                this.sendPendingSkillRewards(skill.Id, tier);
            }
        }
        this.IOManager.saveProgressionFile(this.Progression, `${this.PmcProfile._id}.json`);
    }
    convertSkillProgressToRewardTier(progress) {
        return Math.floor((progress / 100) / 5);
    }
    findDifferenceInRewardLevel(skillId, tier) {
        if (this.Progression.Progress[skillId] !== undefined) {
            return this.Progression.Progress[skillId] - tier;
        }
        return tier;
    }
    sendPendingSkillRewards(skillId, tier) {
        // We want to start awarding the tier after the highest recorded or level 1 if undefined
        const startTier = this.Progression.Progress[skillId] !== undefined
            ? this.Progression.Progress[skillId]
            : 0;
        // Difference in tiers
        const tierDiff = tier - startTier;
        if (tierDiff <= 0)
            return;
        this.logger.logWithColor(`Skills Extended: Pending rewards for ${skillId}. ${tierDiff} tiers!`, LogTextColor_1.LogTextColor.CYAN);
        for (let i = startTier; i <= tier; i++) {
            if (this.sendMailReward(skillId, i)) {
                this.Progression.Progress[skillId] = i;
            }
        }
    }
    generateReward(tier, debug = false) {
        const items = [];
        const hashUtil = this.InstanceManager.hashUtil;
        const itemHelper = this.InstanceManager.itemHelper;
        itemHelper.getSoftInsertSlotIds();
        const locale = this.InstanceManager.database.locales.global.en;
        const rewards = this.SkillRewards.Tiers;
        const tierData = rewards.find(x => x.Tier === tier);
        if (this.SkillRewards.RewardCategories === undefined)
            return;
        if (debug) {
            this.logger.logWithColor(`\nGenerating reward for tier ${tier}`, LogTextColor_1.LogTextColor.YELLOW);
            this.logger.logWithColor("Settings:", LogTextColor_1.LogTextColor.YELLOW);
            this.logger.logWithColor(`Reward value: ${tierData.RewardValue}`, LogTextColor_1.LogTextColor.YELLOW);
            this.logger.logWithColor(`Max amount of same item: ${tierData.MaximumNumberOfMultiples}`, LogTextColor_1.LogTextColor.YELLOW);
        }
        // Shuffle the category keys to ensure randomness
        const itemPrices = this.generateItemPrices();
        const randomShuffle = this.shuffleKeys(itemPrices);
        let rewardValue = 0;
        let itemsReceived = 0;
        for (const item of randomShuffle) {
            // We have more value than allowed
            if (rewardValue > tierData.RewardValue)
                break;
            if (itemsReceived > tierData.ItemAmountRange[1])
                break;
            if (!this.checkForBaseConditions(itemPrices[item], tierData.RewardValue, tier, item))
                continue;
            if (itemHelper.isOfBaseclass(item, BaseClasses_1.BaseClasses.AMMO)) {
                const ammoItem = this.generateAmmoReward(item, tierData);
                itemsReceived += ammoItem?.upd?.StackObjectsCount;
                items.push(ammoItem);
                this.logger.logWithColor(`${locale[`${item} Name`]} amt: (${ammoItem?.upd?.StackObjectsCount}) val: (${itemPrices[item] * ammoItem?.upd?.StackObjectsCount})`, LogTextColor_1.LogTextColor.GREEN);
                continue;
            }
            if (itemHelper.itemRequiresSoftInserts(item)) {
                const armorItem = this.generateArmorReward(item);
                items.push(...armorItem[0]);
                itemsReceived += 1;
                rewardValue += armorItem[1];
                this.logger.logWithColor(`${locale[`${item} Name`]} amt: (1) val: (${armorItem[1]})`, LogTextColor_1.LogTextColor.GREEN);
                continue;
            }
            const amount = this.calculateItemAmountForReward(tierData, item);
            rewardValue += itemPrices[item] * amount;
            for (let i = 0; i < amount; i++) {
                const newItem = {
                    _tpl: item,
                    _id: hashUtil.generate()
                };
                items.push(newItem);
            }
            this.logger.logWithColor(`${locale[`${item} Name`]} amt: (${amount}) val: (${itemPrices[item] * amount})`, LogTextColor_1.LogTextColor.GREEN);
            itemsReceived += amount;
        }
        if (tierData.LegaMedals > 0) {
            items.push(this.generateLegaMedals(tierData));
        }
        if (debug) {
            this.logger.logWithColor(`Total reward value: ${rewardValue} - Item count ${itemsReceived}`, LogTextColor_1.LogTextColor.YELLOW);
        }
        // Set the items found in raid
        itemHelper.setFoundInRaid(items);
        return items;
    }
    /**
     * Builds a dictionary of itemId and price information
     * @param tierData Tier to get item price information for
     * @returns Record of items and prices
     */
    generateItemPrices() {
        const itemPrices = {};
        // Build a price map of all items in all categories
        for (const category of this.SkillRewards.RewardCategories) {
            const rewards = this.getItemsAndPricesOfCategory(category);
            for (const reward in rewards) {
                itemPrices[reward] = rewards[reward];
            }
        }
        return itemPrices;
    }
    /**
     * Check for basic filtering conditions of items
     * @param itemPrice Item price to check
     * @param maxRewardValue Max allowed item price
     * @param tier Tier we are checking for
     * @param itemTpl Item tpl to check
     * @returns true if passes
     */
    checkForBaseConditions(itemPrice, maxRewardValue, tier, itemTpl) {
        const config = this.SkillRewards;
        const itemHelper = this.InstanceManager.itemHelper;
        // Item is black listed, skip it
        if (config.BlackListedItems.includes(itemTpl))
            return false;
        // Item has no price, skip it
        if (itemPrice === 0)
            return false;
        // Item is over this tiers price cap
        if (itemPrice > maxRewardValue && tier < 10)
            return false;
        // Skip dog tags and quest items
        if (itemHelper.isDogtag(itemTpl)
            || itemHelper.isQuestItem(itemTpl)
            || !itemHelper.isValidItem(itemTpl))
            return false;
        return true;
    }
    generateLegaMedals(tierData) {
        const hashUtil = this.InstanceManager.hashUtil;
        const itemHelper = this.InstanceManager.itemHelper;
        const newItem = {
            _tpl: "6656560053eaaa7a23349c86",
            _id: hashUtil.generate()
        };
        if (itemHelper.addUpdObjectToItem(newItem)) {
            newItem.upd.StackObjectsCount = tierData.LegaMedals;
        }
        return newItem;
    }
    generateAmmoReward(itemTpl, tierData) {
        const hashUtil = this.InstanceManager.hashUtil;
        const itemHelper = this.InstanceManager.itemHelper;
        const locale = this.InstanceManager.database.locales.global.en;
        const newItem = {
            _tpl: itemTpl,
            _id: hashUtil.generate()
        };
        const amount = 20 * tierData.Tier < 40
            ? 40
            : 20 * tierData.Tier;
        if (itemHelper.addUpdObjectToItem(newItem)) {
            newItem.upd.StackObjectsCount = amount;
        }
        this.logger.logWithColor(`${locale[`${itemTpl} Name`]} amt: (${amount})`, LogTextColor_1.LogTextColor.GREEN);
        return newItem;
    }
    generateArmorReward(itemTpl) {
        const hashUtil = this.InstanceManager.hashUtil;
        const itemHelper = this.InstanceManager.itemHelper;
        const armor = [];
        const id = hashUtil.generate();
        const newItem = {
            _tpl: itemTpl,
            _id: id
        };
        armor.push(newItem);
        itemHelper.addUpdObjectToItem(newItem);
        const inserts = this.generateSoftArmorInserts(itemTpl, id);
        const price = itemHelper.getItemPrice(itemTpl);
        armor.push(...inserts[0]);
        return [armor, price + inserts[1]];
    }
    generateSoftArmorInserts(itemTpl, itemId) {
        const hashUtil = this.InstanceManager.hashUtil;
        const itemHelper = this.InstanceManager.itemHelper;
        const items = [];
        const db = this.InstanceManager.database.templates.items;
        const slots = db[itemTpl]._props?.Slots;
        const slotIds = itemHelper.getSoftInsertSlotIds();
        if (slots === undefined)
            return [items, 0];
        let platePrices = 0;
        for (const slot of slots) {
            if (!slotIds.includes(slot?._name.toLocaleLowerCase()))
                continue;
            const plate = slot._props.filters[0].Plate;
            const insert = {
                _tpl: plate,
                _id: hashUtil.generate(),
                parentId: itemId,
                slotId: slot._name
            };
            platePrices += itemHelper.getItemPrice(plate);
            items.push(insert);
        }
        return [items, platePrices];
    }
    calculateItemAmountForReward(tierData, itemTpl) {
        const itemHelper = this.InstanceManager.itemHelper;
        let roundedAmount = 0;
        // Blacklisted from having multiple
        if (!itemHelper.isOfBaseclasses(itemTpl, this.SkillRewards.DisallowMultipleSameRoll)) {
            roundedAmount = Math.round(Math.random() * tierData.MaximumNumberOfMultiples);
        }
        // Dont ever give a no items
        const amount = roundedAmount === 0
            ? 1
            : roundedAmount;
        return amount;
    }
    getItemsAndPricesOfCategory(parentId) {
        const itemHelper = this.InstanceManager.itemHelper;
        const itemPriceMap = {};
        const items = itemHelper.getItemTplsOfBaseType(parentId);
        for (const item of items) {
            itemPriceMap[item] = itemHelper.getItemMaxPrice(item);
        }
        return itemPriceMap;
    }
    sendMailReward(skillId, tier) {
        const mailService = this.InstanceManager.mailSendService;
        const traderHelper = this.InstanceManager.traderHelper;
        const traderEnabled = this.IOManager.ServerConfig.EnableTrader;
        const traderToSend = traderEnabled ? "66bf1f65e1f3b83ea069a271" : Traders_1.Traders.THERAPIST;
        const items = this.generateReward(tier);
        if (items.length <= 0)
            return false;
        mailService.sendDirectNpcMessageToPlayer(this.PmcProfile._id, traderHelper.getTraderById(traderToSend), MessageType_1.MessageType.MESSAGE_WITH_ITEMS, `Here is your reward for tier ${tier} of ${skillId}`, items, 720000);
        return true;
    }
    shuffleKeys(record) {
        const keys = Object.keys(record);
        // Fisher-Yates shuffle algorithm
        for (let i = keys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [keys[i], keys[j]] = [keys[j], keys[i]];
        }
        return keys;
    }
}
exports.ProgressionManager = ProgressionManager;
//# sourceMappingURL=ProgressionManager.js.map