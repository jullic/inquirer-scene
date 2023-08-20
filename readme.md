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
		question: {
			type: 'list',
			choices: ['first', 'second'],
			message: 'First Question',
		},
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
		question: {
			type: 'list',
			choices: ['first', 'exit'],
			message: 'First Question',
		},
		parentId: 'first',
		customBackAction: true,
	});

	inquirer.addQuestions([firstQuestion, secondQuestion]);
	await inquirer.start('first');

	console.log(inquirer.context.state);
};

bootstrap();
```
