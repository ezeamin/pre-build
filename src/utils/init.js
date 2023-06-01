import welcome from 'cli-welcome';
// import pkg from '../../package.json';
import unhandled from 'cli-handle-unhandled';

const init = ({ build = false }) => {
  unhandled();
  welcome({
    title: `PRE-BUILD`,
    description: build
      ? 'Build app, running linter first'
      : 'Run linter on project',
    version: "1.0.0",
    bgColor: '#36BB09',
    color: '#000000',
    bold: true,
    clear: true,
  });
};

export default init;
