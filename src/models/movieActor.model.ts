import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMovieActor extends Document {
  movie_id: Types.ObjectId;
  actor_id: Types.ObjectId;
}

const MovieActorSchema = new Schema<IMovieActor>(
  {
    movie_id: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    actor_id: { type: Schema.Types.ObjectId, ref: "Actor", required: true },
  },
  {
    versionKey: false,
  }
);

MovieActorSchema.index({ movie_id: 1, actor_id: 1 }, { unique: true });

export const MovieActor = mongoose.model<IMovieActor>(
  "MovieActor",
  MovieActorSchema,
  "moviesactors"
);
