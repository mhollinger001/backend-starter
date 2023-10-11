import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface QuestionDoc extends BaseDoc {
    question: string;
    answerType: string;
    answer: string;
}

export type InputType = string | number | boolean;

export default class QuestionConcept {
    public readonly questions = new DocCollection<QuestionDoc>("questions");

    private isValidAnswerType(answerType: string) {
        if (!new Set(["string", "number", "boolean"]).has(answerType)) {
            throw new BadValuesError(`AnswerType is not a string, number, or a boolean`);
        }
    }

    async create(question: string, answerType: string, answer: string) {
        this.isValidAnswerType(answerType);
        const _id = await this.questions.createOne({ question, answerType, answer });
    }

    async getQuestionById(_id: ObjectId) {
        const question = await this.questions.readOne({ _id });
        if (question === null) {
            throw new NotFoundError(`Question Not Found!`);
        }
        return question;
    }

    async answerQuestion(_id: ObjectId, answer: InputType) {
        const question = await this.getQuestionById(_id);
        return (typeof answer) === question.answerType && answer.toString() === question.answer;
    }

    async update(_id: ObjectId, update: Partial<QuestionDoc>) {
        if (update.answerType !== undefined) {
            this.isValidAnswerType(update.answerType);
        }
        await this.questions.updateOne({ _id }, update);
        return { msg: "Question Updated!" };
    }

    async delete(_id: ObjectId) {
        await this.questions.deleteOne({ _id });
        return { msg: "Question Deleted" };
    }
}