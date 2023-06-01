import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	build: {
		type: `boolean`,
		default: false,
		alias: `b`,
		desc: `Build app`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `pre-build`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
