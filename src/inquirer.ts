import { InquirerContext } from './inquirer-context';
import { IInquirerContext } from './interfaces/inquirer-context.interface';
import { IInquirer } from './interfaces/inquirer.interface';
import { IQuestion } from './interfaces/question.interface';

export class Inquirer<T extends Record<string, any> = Record<string, any>> implements IInquirer<T> {
	context: IInquirerContext<T>;
	private readonly defaultState: T;

	constructor(defaultState: T) {
		this.defaultState = { ...defaultState };
		this.context = new InquirerContext<T>(defaultState);
	}

	async start(id: string) {
		return await this.context.getQuestion(id);
	}

	addQuestions(questions: IQuestion<T>[]) {
		let ids = [...questions, ...this.context.questions].map((question) => question.id);
		const idDictionary: Record<string, any> = {};
		ids.forEach((id) => {
			if (idDictionary[id]) {
				throw new Error(`Ids must be unique: "${id}"`);
			}
			idDictionary[id] = id;
		});

		questions.forEach((question) => {
			let existId = false;
			if (question.id === question.parentId) {
				throw new Error(`parentId should be different from questionId: "${question.id}"`);
			}
			if (question.parentId) {
				for (const id of ids) {
					if (id === question.parentId) {
						existId = true;
						break;
					}
				}
				if (!existId) {
					throw new Error('Incorrect parent id');
				}
			}
		});
		this.context.questions.push(...questions);
	}

	resetState() {
		this.context.state = this.defaultState;
	}
}
