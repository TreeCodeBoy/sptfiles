"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const MessageType_1 = require("C:/snapshot/project/obj/models/enums/MessageType");
const GiveUserPresetSptCommand_1 = require("./GiveUserPresetSptCommand");
class GiveUI {
    preSptLoad(container) {
        container.register("GiveUserPresetSptCommand", GiveUserPresetSptCommand_1.GiveUserPresetSptCommand);
        container.resolve("SptCommandoCommands").registerSptCommandoCommand(container.resolve("GiveUserPresetSptCommand"));
        const logger = container.resolve('WinstonLogger');
        const databaseServer = container.resolve('DatabaseServer');
        const saveServer = container.resolve('SaveServer');
        const watermark = container.resolve('Watermark');
        const preAkiModLoader = container.resolve('PreSptModLoader');
        const commando = container.resolve('CommandoDialogueChatBot');
        const staticRouterModService = container.resolve('StaticRouterModService');
        // Hook up a new static route
        staticRouterModService.registerStaticRouter('GiveUIModRouter', [
            {
                url: '/give-ui/server',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading server info`, LogTextColor_1.LogTextColor.GREEN);
                    const version = watermark.getVersionTag();
                    const serverPath = node_path_1.default.resolve();
                    const modsInstalled = Object.values(preAkiModLoader.getImportedModDetails());
                    const giveUiMod = modsInstalled.find((m) => m.name === 'give-ui');
                    const modVersion = giveUiMod?.version;
                    return Promise.resolve(JSON.stringify({ version, path: serverPath, modVersion }));
                },
            },
            {
                url: '/give-ui/profiles',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading profiles`, LogTextColor_1.LogTextColor.GREEN);
                    return Promise.resolve(JSON.stringify(saveServer.getProfiles()));
                },
            },
            {
                url: '/give-ui/items',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading items`, LogTextColor_1.LogTextColor.GREEN);
                    return Promise.resolve(JSON.stringify({
                        items: databaseServer.getTables().templates.items,
                        globalPresets: databaseServer.getTables().globals.ItemPresets
                    }));
                },
            },
            {
                url: '/give-ui/give',
                action: (_url, request, sessionId, _output) => {
                    const command = `spt give ${request.itemId} ${request.amount}`;
                    logger.log(`[give-ui] Running command: [${command}]`, LogTextColor_1.LogTextColor.GREEN);
                    const message = {
                        dialogId: sessionId,
                        type: MessageType_1.MessageType.SYSTEM_MESSAGE,
                        text: command,
                        replyTo: undefined,
                    };
                    const response = commando.handleMessage(sessionId, message);
                    return Promise.resolve(JSON.stringify({ response }));
                },
            },
            {
                url: '/give-ui/give-user-preset',
                action: (_url, request, sessionId, _output) => {
                    const command = `spt give-user-preset ${request.itemId}`;
                    logger.log(`[give-ui] Running command: [${command}]`, LogTextColor_1.LogTextColor.GREEN);
                    const message = {
                        dialogId: sessionId,
                        type: MessageType_1.MessageType.SYSTEM_MESSAGE,
                        text: command,
                        replyTo: undefined,
                    };
                    const response = commando.handleMessage(sessionId, message);
                    return Promise.resolve(JSON.stringify({ response }));
                },
            },
        ], 'give-ui-top-level-route');
    }
}
module.exports = { mod: new GiveUI() };
//# sourceMappingURL=mod.js.map