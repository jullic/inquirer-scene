import { IInquirerContext } from './interfaces/inquirer-context.interface';
import { IQuestion } from './interfaces/question.interface';

export class InquirerContext<T extends Record<string, any> = Record<string, any>> implements IInquirerContext<T> {
	state: T;
	currentQuestion: IQuestion<T> | null;
	questions: IQuestion<T>[];

	constructor(defaultState: T) {
		this.state = defaultState;
		this.currentQuestion = null;
		this.questions = [];
	}

	async getQuestion(id: string): Promise<any> {
		const question = this.questions.find((question) => question.id === id);
		if (!question) {
			throw new Error('Incorrect question id');
		}
		this.currentQuestion = question;
		return await question.action(this);
	}
}
