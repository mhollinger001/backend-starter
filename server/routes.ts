import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Comment, Exercise, Friend, Lesson, Post, Question, User, Video, WebSession } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { QuestionDoc } from "./concepts/question";
import { UserDoc } from "./concepts/user";
import { VideoDoc } from "./concepts/video";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.get("/comments")
  async getComments() {
    return await Comment.getComments();
  }

  @Router.get("/comments/:username")
  async getCommentsByUsername(username: string) {
    const id = (await User.getUserByUsername(username))._id;
    return await Comment.getCommentsByAuthorId(id);
  }

  @Router.get("/reply/:_id")
  async getReplies(_id: ObjectId) {
    return await Comment.getRepliesFromId(_id);
  }

  @Router.post("/comments")
  async createComment(session: WebSessionDoc, content: string, parentId: ObjectId | null) {
    const user = WebSession.getUser(session);
    return await Comment.create(user, content, parentId);
  }

  @Router.delete("/comments")
  async deleteAllComments() {
    return await Comment.deleteAll();
  }
  
  @Router.get("/exercise/:_id")
  async getExercisesByTitle(_id: ObjectId) {
    return await Exercise.getExerciseById(_id);
  }

  @Router.post("/exercise")
  async createExercise(title: string) {
    return await Exercise.create(title, []);
  }

  @Router.patch("/exercise/add/:_id")
  async addToExercise(_id: ObjectId, question: ObjectId, location: number = -1) {
    return await Exercise.addQuestions(_id, [question], location);
  } 
  
  @Router.patch("/exercise/remove/:_id")
  async removeFromExercise(_id: ObjectId, question: ObjectId) {
    return await Exercise.removeQuestions(_id, new Set([question]))
  } 

  @Router.delete("/exercise")
  async deleteExercise(_id: ObjectId) {
    return await Exercise.delete(_id);
  }

  @Router.get("/question/:_id")
  async getQuestion(_id: ObjectId) {
    return await Question.getQuestionById(_id);
  }

  @Router.post("/question")
  async createQuestion(question: string, answerType: string, answer: string) {
    return await Question.create(question, answerType, answer);
  }

  @Router.patch("/question/:_id")
  async updateQuestion(_id: ObjectId, update: Partial<QuestionDoc>) {
    return await Question.update(_id, update);
  }

  @Router.delete("/question/:_id")
  async deleteQuestion(_id: ObjectId) {
    return await Question.delete(_id);
  }

  @Router.get("/video/:_id")
  async getVideo(_id: ObjectId) {
    return await Video.getVideoById(_id);
  }

  @Router.post("/video")
  async createVideo(title: string, videoUrl: string) {
    return await Video.create(title, videoUrl);
  }

  @Router.patch("/video/:_id")
  async updateVideo(_id: ObjectId, update: Partial<VideoDoc>) {
    return await Video.update(_id, update);
  }

  @Router.delete("/video/:_id")
  async deleteVideo(_id: ObjectId) {
    return await Video.delete(_id);
  }

  @Router.get("/lesson")
  async getLesson(_id: ObjectId) {
    return await Lesson.getLessonById(_id);
  }

  @Router.post("/lesson")
  async createLesson(session: WebSessionDoc, title: string) {
    const user = WebSession.getUser(session);
    return await Lesson.create(user, title, []);
  }

  @Router.patch("/lesson/add/:_id")
  async addToLesson(session: WebSessionDoc, _id: ObjectId, subLesson: ObjectId, location: number = -1) {
    const user = WebSession.getUser(session);
    await Lesson.isAuthor(user, _id);
    return await Lesson.addSubLessons(_id, [subLesson], location);
  } 
  
  @Router.patch("/lesson/remove/:_id")
  async removeFromLesson(session: WebSessionDoc, _id: ObjectId, subLesson: ObjectId) {
    const user = WebSession.getUser(session);
    await Lesson.isAuthor(user, _id);
    return await Lesson.removeSubLessons(_id, new Set([subLesson]))
  } 

  @Router.delete("/lesson")
  async deleteLesson(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Lesson.isAuthor(user, _id);
    return await Lesson.delete(_id);
  }
}

export default getExpressRouter(new Routes());
