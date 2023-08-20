import { IQuestion } from './question.interface';

export interface IInquirerContext<T extends Record<string, any> = Record<string, any>> {
	state: T;
	currentQuestion: IQuestion<T> | null;
	questions: IQuestion<T>[];
	getQuestion: (id: string) => Promise<any>;
}
