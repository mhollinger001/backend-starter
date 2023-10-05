import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export type InputType = string | number | boolean;

export interface QuestionInfo {
    question: string;
    answerType: string;
    answer: string;
}

export interface ExerciseQuestionInfo extends QuestionInfo {
    exerciseId: ObjectId;
}

export interface QuestionDoc extends ExerciseQuestionInfo, BaseDoc {}

export interface ExerciseDoc extends BaseDoc {
    title: string;
}

export default class ExerciseConcept {
    public readonly exercises = new DocCollection<ExerciseDoc>("exercises");
    public readonly questions = new DocCollection<QuestionDoc>("questions");

    async createExercise(title: string, questions: QuestionInfo[] = []) {
        const _id = await this.exercises.createOne({ title });
        questions.forEach(async (question) => await this.createQuestion({ ...question, exerciseId: _id}));
        return {
            msg: "Exercise created successfully!",
            exercise: await this.exercises.readOne({ _id }),
            questions: await this.questions.readMany( { exerciseId: _id })
        };
    }

    async createQuestion(question: ExerciseQuestionInfo) {
        const _id = await this.questions.createOne(question);
        return { msg: "Question created Successfully!", question: await this.questions.readOne({ _id }) };
    }

    async getExeciseById(_id: ObjectId) {
        const exercise = await this.exercises.readOne({ _id });
        if (exercise === null) {
            throw new NotFoundError(`Exercise not found!`);
        }
        return exercise;
    }

    async getExerciseByTitle(title: string) {
        const exercise = await this.exercises.readOne({ title });
        if (exercise === null) {
            throw new NotFoundError(`Exercise not found!`);
        }
        return exercise;
    }

    async getQuestionById(_id: ObjectId) {
        const question = await this.questions.readOne({ _id });
        if (question === null) {
            throw new NotFoundError(`Question not found!`);
        }
        return question;
    }

    async getQuestionsByExerciseId(_id: ObjectId) {
        const questions = await this.questions.readMany({ exerciseId: _id });
        if (questions === null) {
            throw new NotFoundError(`Exercise not found!`);
        }
        return questions;
    }

    async updateExerciseTitle(_id: ObjectId, title: string) {
        await this.exercises.updateOne({ _id }, { title });
        return { msg: "Exercise updated successfully!"};
    }

    async updateQuestion(_id: ObjectId, update: Partial<QuestionDoc>) {
        await this.questions.updateOne({ _id }, update);
        return { msg: "Question updated successfully!"};
    }

    async answerQuestion(_id: ObjectId, input: InputType) {
        const questionInfo = await this.getQuestionById(_id);
        return typeof input === questionInfo.answerType && input.toString() === questionInfo.answer;
    }
}