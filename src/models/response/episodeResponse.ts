import EpisodeModel from "../database/api/episodeModel";

export default class EpisodeResponse {
    episode_id: number;
    season: number;
    episode: number;
    netflix_id: number;

    static fromModel(model: EpisodeModel) {
        const resp = new EpisodeResponse();

        resp.episode_id = model.id;
        resp.episode = model.episode;
        resp.season = model.season;
        resp.netflix_id = model.netflixId;

        return resp;
    }
}
