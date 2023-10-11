import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface LessonDoc extends BaseDoc {
    title: string;
    subLessons: ObjectId[];
}

export default class LessonConcept {
    public readonly lessons = new DocCollection<LessonDoc>("lessons");

    async create(title: string, subLessons: ObjectId[]) {
        const _id = await this.lessons.createOne({ title, subLessons });
        return { msg: "Lesson Created!", lesson: await this.lessons.readOne({ _id }) };
    }

    async getLessonById(_id: ObjectId) {
        const lesson = await this.lessons.readOne({ _id });
        if (lesson === null) {
            throw new NotFoundError(`Lesson Not Found!`);
        }
        return lesson;
    }

    async addSubLessons(_id: ObjectId, newSubLessons: ObjectId[], location: number = -1) {
        const lesson = await this.getLessonById(_id);
        const subLessons = lesson.subLessons;
        if (location === -1) location = subLessons.length;
        subLessons.splice(location, 0, ...newSubLessons);
        return this.update(_id, { subLessons });
    }

    async removeSubLessons(_id: ObjectId, subLessonsToRemove: Set<ObjectId>) {
        const lesson = await this.getLessonById(_id);
        const subLessons = lesson.subLessons.filter((value) => !subLessonsToRemove.has(value));
        return this.update(_id, { subLessons });
    }

    async update(_id: ObjectId, update: Partial<LessonDoc>) {
        await this.lessons.updateOne({ _id }, update);
        return { msg: "Lesson Updated!" };
    }

    async delete(_id: ObjectId) {
        await this.lessons.deleteOne({ _id });
        return { msg: "Lesson Deleted!" };
    }
}