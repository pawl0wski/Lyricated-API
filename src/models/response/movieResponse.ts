import MovieNameResponse from "./translations/movieNameResponse";
import MovieModel from "../database/api/movieModel";
import EpisodeResponse from "./episodeResponse";

export default class MovieResponse {
    id: number;
    lang: string;
    type: "movie" | "serie";
    netflix_id?: number;
    minutes: number;
    movie_names: MovieNameResponse[];
    episodes: EpisodeResponse[];

    static fromModel(model: MovieModel): MovieResponse {
        const resp = new MovieResponse();

        resp.id = model.id;
        resp.lang = model.lang?.id;
        resp.type = model.episodes?.length === 0 ? "movie" : "serie";
        resp.netflix_id = model.netflixId;
        resp.minutes = model.minutes;
        resp.movie_names = model.movieNames?.map((e) =>
            MovieNameResponse.fromModel(e)
        );
        resp.episodes = model.episodes.map((e) => EpisodeResponse.fromModel(e));

        return resp;
    }
}