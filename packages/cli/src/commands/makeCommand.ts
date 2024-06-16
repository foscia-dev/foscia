import makeActionCommand from '@foscia/cli/commands/make/makeActionCommand';
import makeComposableCommand from '@foscia/cli/commands/make/makeComposableCommand';
import makeEnhancerCommand from '@foscia/cli/commands/make/makeEnhancerCommand';
import makeLoaderCommand from '@foscia/cli/commands/make/makeLoaderCommand';
import makeModelCommand from '@foscia/cli/commands/make/makeModelCommand';
import makeModelFactoryCommand from '@foscia/cli/commands/make/makeModelFactoryCommand';
import makeModelsCommand from '@foscia/cli/commands/make/makeModelsCommand';
import makeReducerCommand from '@foscia/cli/commands/make/makeReducerCommand';
import makeReviverCommand from '@foscia/cli/commands/make/makeReviverCommand';
import makeRunnerCommand from '@foscia/cli/commands/make/makeRunnerCommand';
import makeTransformerCommand from '@foscia/cli/commands/make/makeTransformerCommand';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import pc from 'picocolors';

export default function makeCommand() {
  return makeCommander('make')
    .description('Create Foscia related files')
    .addHelpText('after', makeUsageExamples([
      ['Creates a "Post" model', `${pc.bold('make model')} post`],
      ['Creates a "publishable" composable', `${pc.bold('make composable')} publishable`],
    ]))
    .addCommand(makeModelCommand())
    .addCommand(makeComposableCommand())
    .addCommand(makeTransformerCommand())
    .addCommand(makeLoaderCommand())
    .addCommand(makeReducerCommand())
    .addCommand(makeReviverCommand())
    .addCommand(makeModelFactoryCommand())
    .addCommand(makeModelsCommand())
    .addCommand(makeActionCommand())
    .addCommand(makeEnhancerCommand())
    .addCommand(makeRunnerCommand());
}
