// import gradient from 'gradient-string';
import { exec } from 'child_process';
import { execa } from 'execa';

const runCommand = (command, type, successMessage, errorMessage) => {
  return new Promise((resolve, reject) => {
    console.log(`⌛ ${type}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `\x1b[31m❌ ${errorMessage}\n${error.message}\n${stdout}\x1b[0m`
        );
        reject();
      } else if (stderr) {
        console.error(
          `\x1b[31m❌ ${errorMessage}\n${stderr}\n${stdout}\x1b[0m`
        );
        reject();
      } else {
        console.log(`\x1b[32m✅ ${successMessage}\x1b[0m`);
        console.log();
        resolve();
      }
    });
  });
};

const parseArguments = () => {
  const args = process.argv.slice(2);
  const argumentRegex = /^--\w+(?:-\w+)?$/;

  const parsedArgs = [];
  let currentArg = null;

  for (const arg of args) {
    if (argumentRegex.test(arg)) {
      if (currentArg) {
        parsedArgs.push(currentArg);
      }
      currentArg = arg;
    } else if (currentArg) {
      currentArg += ` ${arg}`;
    }
  }

  if (currentArg) {
    parsedArgs.push(currentArg);
  }

  return parsedArgs;
};

// const runPreBuildScript = async () => {
//   let isLint = false;
//   const buildArguments = parseArguments();
//   const args = buildArguments.join(' ');

//   if (args.includes('--ignore-build')) {
//     isLint = true;
//   }

//   console.clear();
//   if (isLint) console.log('\x1b[33m🔍 Running lint script...\x1b[0m\n');
//   else console.log('\x1b[33m🔧 Running pre-build script...\x1b[0m\n');

//   try {
//     await runCommand(
//       'tsc',
//       'TypeScript',
//       'TypeScript compilation succeeded',
//       'TypeScript compilation failed\n\n'
//     );
//     await runCommand(
//       'npx eslint .',
//       'ESLint',
//       'ESLint check passed',
//       'ESLint check failed\n\n'
//     );
//     if (!isLint) {
//       console.log(
//         '\x1b[33m⚠️  WARNING: Prettier will check AND overwrite your files, starting in 5... ⚠️\x1b[0m'
//       );
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//       console.log('\x1b[33m⚠️  WARNING: Starting Prettier fix...\x1b[0m\n');
//     }
//     await runCommand(
//       isLint ? 'npm run prettier:check' : 'npm run prettier:write',
//       isLint ? 'Prettier (only check)' : 'Prettier',
//       isLint ? 'Prettier check passed' : 'Prettier fix finished',
//       isLint ? 'Prettier check passed' : 'Prettier fix failed.\n\n'
//     );

//     console.log(
//       '═════════════════════════════════════════════════════════════\n'
//     );
//     // const successMessage = gradient(
//     //   '#7aecdd',
//     //   '#ffffff',
//     //   '#f78df7'
//     // )(
//     //   isLint
//     //     ? 'Lint completed successfully! Site is ready for deployment'
//     //     : 'Pre-build script completed successfully!'
//     // );
//     const successMessage = 'hola';
//     console.log(`\x1b[33m✨ ${successMessage}\x1b[0m\n`);
//     console.log(
//       '═════════════════════════════════════════════════════════════\n'
//     );

//     if (!isLint) runBuildCommand();
//   } catch (error) {
//     console.error('\n\x1b[31m❌ Pre-build script failed to complete\x1b[0m\n');
//   }
// };

const runBuildCommand = () => {
  const buildArguments = parseArguments();
  const args = buildArguments.join(' ');
  const env = args.includes('--mode')
    ? buildArguments.find((arg) => arg.includes('--mode'))?.split(' ')[1]
    : 'production';

  const buildCommand = `vite build ${args}`;

  console.log('\x1b[33m🚀 Running build command...\x1b[0m');
  if (args) console.log(`\n\x1b[33m🔧 Args are: \x1b[0m${args}`);
  console.log(`\x1b[33m⚙️  Using .env: \x1b[0m${env}`);

  exec(buildCommand, (error, stdout, stderr) => {
    console.log('\n', stdout);
    if (stderr) console.log(stderr);

    if (error) {
      console.error(`\n\x1b[31m❌ Build failed: ${error.message}\x1b[0m`);
    } else {
      console.log('\n\x1b[32m✅ Build succeeded\x1b[0m');
    }
    console.log(
      '\n═════════════════════════════════════════════════════════════\n'
    );
  });
};

const runPreBuildScript = async () => {
  try {
    // Run tsc command
    const tscResult = await execa('tsc', [], { stdio: 'inherit' });
    console.log('TSC Result:', tscResult);
  } catch (error) {
    console.error(
      '\x1b[31m❌ An error occurred during the pre-build process.\x1b[0m'
    );
    console.error(error);
    process.exit(1);
  }

  try {
    // Run eslint command
    const eslintResult = await execa('eslint', ['--ext', '.ts', '--fix', '.'], {
      stdio: 'inherit',
    });
    console.log('ESLint Result:', eslintResult);
  } catch (error) {
    console.error(
      '\x1b[31m❌ An error occurred during the pre-build process.\x1b[0m'
    );
    console.error(error);
    process.exit(1);
  }

  try {
    // Run prettier command
    const prettierResult = await execa('prettier', ['--write', '.'], {
      stdio: 'inherit',
    });
    console.log('Prettier Result:', prettierResult);
  } catch (error) {
    console.error(
      '\x1b[31m❌ An error occurred during the pre-build process.\x1b[0m'
    );
    console.error(error);
    process.exit(1);
  }

  console.log('\x1b[32m✅ Pre-build process completed successfully.\x1b[0m');
  console.log();
};

export { runPreBuildScript };
