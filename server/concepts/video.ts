import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";


export interface VideoDoc extends BaseDoc {
    title: string;
    videoUrl: string;
}

export default class VideoConcept {
    public readonly videos = new DocCollection<VideoDoc>("videos");

    async create(title: string, videoUrl: string) {
        const _id = await this.videos.createOne({ title, videoUrl });
        return { msg: "Video Created!", video: await this.videos.readOne({ _id }) };
    }

    async getVideoById(_id: ObjectId) {
        const video = await this.videos.readOne({ _id });
        if (video === null) {
            throw new NotFoundError(`Video not found!`);
        }
        return video;
    }

    async update(_id: ObjectId, update: Partial<VideoDoc>) {
        await this.videos.updateOne({ _id }, update);
        return { msg: "Video Updated!" };
    }

    async delete(_id: ObjectId) {
        await this.videos.deleteOne({ _id });
        return { msg: "Video Deleted!" };
    }
}