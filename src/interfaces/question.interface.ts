import { IInquirerContext } from './inquirer-context.interface';
import {
	EditorQuestion,
	ExpandQuestion,
	InputQuestion,
	ListQuestion,
	NumberQuestion,
	ConfirmQuestion,
	RawListQuestion,
	CheckboxQuestion,
	PasswordQuestion,
} from 'inquirer';

export type QuestionType =
	| Omit<EditorQuestion, 'name'>
	| Omit<ExpandQuestion, 'name'>
	| Omit<InputQuestion, 'name'>
	| (Omit<ListQuestion, 'name'> & { customBack?: string })
	| Omit<NumberQuestion, 'name'>
	| Omit<ConfirmQuestion, 'name'>
	| Omit<RawListQuestion, 'name'>
	| Omit<CheckboxQuestion, 'name'>
	| Omit<PasswordQuestion, 'name'>;

export interface IQuestion<T extends Record<string, any> = Record<string, any>, S extends QuestionType = QuestionType> {
	id: string;
	parentId?: string;
	action: (context: IInquirerContext<T>) => Promise<any>;
	question: S;
	configureQuestion: (context: IInquirerContext<T>) => S;
	back?: boolean;
	customBack?: string;
}
