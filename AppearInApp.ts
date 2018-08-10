import {
		IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    ILogger,
    IRead,
    IModify,
    IHttp,
    IPersistence,
    HttpStatusCode
} from '@rocket.chat/apps-ts-definition/accessors';

import {
	ISlashCommand,
	SlashCommandContext
} from '@rocket.chat/apps-ts-definition/slashcommands';

import { App } from '@rocket.chat/apps-ts-definition/App';
import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

export class AppearInAppCommand implements ISlashCommand {
	public command: string;
	public i18nDescription: string;
	public i18nParamsExample: string;
	public providesPreview: false;

	constructor(private readonly app: App) {
		this.command = 'appear';
		this.i18nParamsExample = '';
		this.i18nDescription = 'Generate an appear.in video meeting URL.';
		this.providesPreview = false;
	}

	public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
		const builder = modify.getCreator().startMessage().setSender(context.getSender()).setRoom(context.getRoom());
		const args = context.getArguments();
		let roomName;

		if (args && args.length) {
			roomName = args[0];
		} else {
			//Generate a random string
			roomName = Math.random().toString(36).substring(2);
		}

		builder.setText(`https://appear.in/${ roomName }`);
		await modify.getCreator().finish(builder);
	}
}
export class AppearInApp extends App {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async initialize(configurationExtend: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await this.extendConfiguration(configurationExtend, environmentRead);
        configurationExtend.slashCommands.provideSlashCommand(new AppearInAppCommand(this));
    }
}