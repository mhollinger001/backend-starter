import CommentConcept from "./concepts/comments";
import ExerciseConcept from "./concepts/exercise";
import FriendConcept from "./concepts/friend";
import LessonConcept from "./concepts/lesson";
import PostConcept from "./concepts/post";
import QuestionConcept from "./concepts/question";
import UserConcept from "./concepts/user";
import VideoConcept from "./concepts/video";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Comment = new CommentConcept();
export const Exercise = new ExerciseConcept();
export const Question = new QuestionConcept();
export const Video = new VideoConcept();
export const Lesson = new LessonConcept();