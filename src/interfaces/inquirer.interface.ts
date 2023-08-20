import { IInquirerContext } from './inquirer-context.interface';
import { IQuestion } from './question.interface';

export interface IInquirer<T extends Record<string, any> = Record<string, any>> {
	context: IInquirerContext<T>;

	start: (id: string) => Promise<any>;
	addQuestions: (questions: IQuestion<T>[]) => void;
	resetState: () => void;
}
