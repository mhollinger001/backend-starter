import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface ExerciseDoc extends BaseDoc {
    title: string;
    questions: ObjectId[];
}

export default class ExerciseConcept {
    public readonly exercises = new DocCollection<ExerciseDoc>("exercises");

    async create(title: string, questions: ObjectId[]) {
        const _id = await this.exercises.createOne({ title, questions });
        return { msg: "Exercise Created!", lesson: await this.exercises.readOne({ _id }) };
    }

    async getExerciseById(_id: ObjectId) {
        const exercise = await this.exercises.readOne({ _id });
        if (exercise === null) {
            throw new NotFoundError(`Exercise Not Found!`);
        }
        return exercise;
    }

    async addQuestions(_id: ObjectId, newQuestions: ObjectId[], location: number = -1) {
        const exercise = await this.getExerciseById(_id);
        const questions = exercise.questions;
        if (location === -1) location = questions.length;
        questions.splice(location, 0, ...newQuestions);
        return this.update(_id, { questions });
    }

    async removeQuestions(_id: ObjectId, questionsToRemove: Set<ObjectId>) {
        const exercise = await this.getExerciseById(_id);
        const questions = exercise.questions.filter((value) => !questionsToRemove.has(value));
        return this.update(_id, { questions });
    }

    async update(_id: ObjectId, update: Partial<ExerciseDoc>) {
        await this.exercises.updateOne({ _id }, update);
        return { msg: "Exercise Updated!" };
    }

    async delete(_id: ObjectId) {
        await this.exercises.deleteOne({ _id });
        return { msg: "Exercise Deleted!" };
    }
}