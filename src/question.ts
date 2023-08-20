import inquirer from 'inquirer';
import chalk from 'chalk';
import { IInquirerContext } from './interfaces/inquirer-context.interface';
import { IQuestion, QuestionType } from './interfaces/question.interface';

export interface IQuestionProps<T extends Record<string, any> = Record<string, any>> {
	id: string;
	action: (context: IInquirerContext<T>, answer: unknown) => Promise<any>;
	question: QuestionType;
	customBack?: string | undefined;
	parentId?: string;
	customBackAction?: boolean;
}

export class Question<T extends Record<string, any> = Record<string, any>> implements IQuestion<T> {
	id: string;
	parentId?: string | undefined;
	question: QuestionType;
	customBack?: string | undefined;
	action: (context: IInquirerContext<T>) => Promise<any>;
	private defaultBackButton: string;
	private customBackAction: boolean;

	constructor(props: IQuestionProps<T>) {
		this.id = props.id;
		this.customBack = props.customBack;
		this.defaultBackButton = chalk.blue('Back');
		this.parentId = props.parentId;
		this.customBackAction = !!props.customBackAction;

		if (props.question.type === 'list' && this.parentId) {
			const choices = props.question.choices as string[];
			this.question = {
				...props.question,
				choices: [...choices, this.customBack || this.defaultBackButton],
			};
		} else {
			this.question = props.question;
		}

		this.action = async (context: IInquirerContext<T>) => {
			const { answer } = await inquirer.prompt([{ ...this.question, name: 'answer' }]);

			if (this.question.type === 'list' && (answer === this.defaultBackButton || answer === this.customBack)) {
				if (this.parentId && !this.customBackAction) {
					return await context.getQuestion(this.parentId);
				} else if (!this.customBackAction) {
					return;
				}
			}
			await props.action(context, answer);
		};
	}
}