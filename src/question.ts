import inquirer from 'inquirer';
import chalk from 'chalk';
import { IInquirerContext } from './interfaces/inquirer-context.interface';
import { IQuestion, QuestionType } from './interfaces/question.interface';

export interface IQuestionProps<
	T extends Record<string, any> = Record<string, any>,
	S extends QuestionType = QuestionType
> {
	id: string;
	action: (context: IInquirerContext<T>, answer: unknown) => Promise<any>;
	configureQuestion: (context: IInquirerContext<T>) => S;
	context: IInquirerContext<T>;
	customBack?: string | undefined;
	parentId?: string;
	customBackAction?: boolean;
}

export class Question<T extends Record<string, any> = Record<string, any>, S extends QuestionType = QuestionType>
	implements IQuestion<T, S>
{
	id: string;
	parentId?: string | undefined;
	question: S;
	configureQuestion: (context: IInquirerContext<T>) => S;
	customBack?: string | undefined;
	action: (context: IInquirerContext<T>) => Promise<any>;
	private defaultBackButton: string;
	private customBackAction: boolean;

	constructor(props: IQuestionProps<T, S>) {
		this.id = props.id;
		this.customBack = props.customBack;
		this.defaultBackButton = chalk.blue('Back');
		this.parentId = props.parentId;
		this.customBackAction = !!props.customBackAction;

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

		this.configureQuestion = (context: IInquirerContext<T>) => {
			const question = props.configureQuestion(context);
			if (question.type === 'list' && this.parentId) {
				const choices = question.choices as string[];
				this.question = {
					...question,
					choices: [...choices, this.customBack || this.defaultBackButton],
				};
			} else {
				this.question = question;
			}
			return question;
		};
		this.question = this.configureQuestion(props.context);
	}
}
