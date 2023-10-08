import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  author: string;
  content: string;
  likes: number;
  parentId: ObjectId | null;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(author: string, content: string, parentId: ObjectId | null = null) {
    const _id = await this.comments.createOne({ author, content, likes: 0, parentId: parentId });
    return { msg: "Comment created successfully!", comment: await this.comments.readOne({ _id }) };
  }

  async getCommentById(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (comment === null) {
      throw new NotFoundError(`Comment not found!`);
    }
    return comment;
  }

  async getCommentsByAuthor(author: string) {
    const comments = await this.comments.readMany({ author });
    if (comments === null) {
      throw new NotFoundError(`User has no comments!`);
    }
    return comments;
  }

  async getComments() {
    const comments = await this.comments.readMany({});
    return comments;
  }

  async getRepliesFromId(_id: ObjectId) {
    return await this.comments.readMany({ parentId: _id});
  }

  async updateContent(_id: ObjectId, content: string) {
    await this.comments.updateOne({ _id }, { content });
    return { msg: "Comment updated successfully!", comment: await this.comments.readOne({ _id }) };
  }

  async updateLikes(_id: ObjectId, likes: number) {
    await this.comments.updateOne({ _id }, { likes });
    return { msg: "Comment updated successfully!", comment: await this.comments.readOne({ _id }) };
  }

  async addLike(_id: ObjectId) {
    const { likes, ...rest } = await this.getCommentById(_id);
    return this.updateLikes(_id, likes + 1);
  }
  
  async removeLike(_id: ObjectId) {
    const { likes, ...rest } = await this.getCommentById(_id);
    return this.updateLikes(_id, Math.max(likes - 1, 0));
  }
  
  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment deleted!" };
  }
}