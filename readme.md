# inquirer-scene

Library for writing menus for inquirer

### Example

```ts
import { Inquirer, Question } from 'inquirer-scene';

interface IDefaultState {
	first: string;
	second: string;
}

export const bootstrap = async () => {
	const defaultState = {
		first: '',
		second: '',
	};

	const inquirer = new Inquirer<IDefaultState>(defaultState);

	const firstQuestion = new Question<IDefaultState>({
		id: 'first',
		action: async (context, answer) => {
			if (typeof answer === 'string') {
				context.state.first = answer;
			}
			if (answer === 'first') {
				return;
			}
			await context.getQuestion('second');
		},
		configureQuestion: (context) => ({
			type: 'list',
			choices: ['first', 'second'],
			message: 'First Question',
		}),
		context: inquirer.context,
	});

	const secondQuestion = new Question<IDefaultState>({
		id: 'second',
		action: async (context, answer) => {
			console.log(answer);
			if (answer !== 'exit') {
				context.state.second = answer as string;
			}
			if (answer === 'exit') {
				return;
			}
			await context.getQuestion('first');
		},
		configureQuestion: (context) => ({
			type: 'list',
			choices: ['first', 'exit'],
			message: 'Second Question',
		}),
		context: inquirer.context,
		parentId: 'first',
	});

	inquirer.addQuestions([firstQuestion, secondQuestion]);
	await inquirer.start('first');

	console.log(inquirer.context.state);
};
```
