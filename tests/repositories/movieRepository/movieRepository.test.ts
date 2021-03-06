import MovieModel from "../../../src/models/database/api/movieModel";
import EpisodeModel from "../../../src/models/database/api/episodeModel";
import MovieRepository from "../../../src/repositories/movieRepository/movieRepository";
import { FindOptions } from "sequelize";
import MovieType from "../../../src/models/enums/movieTypeEnum";

jest.mock("../../../src/models/database/api/movieModel");
jest.mock("../../../src/models/database/error/errorModel");
jest.mock("../../../src/models/database/api/episodeModel");

describe("MovieRepository", () => {
    let testMovies: MovieModel[];

    beforeEach(() => {
        const firstMovieModel = new MovieModel();
        firstMovieModel.id = 1;
        firstMovieModel.episodes = [];
        firstMovieModel.episodes.push(new EpisodeModel());

        const secondMovieModel = new MovieModel();
        secondMovieModel.episodes = [];
        secondMovieModel.id = 2;

        testMovies = [firstMovieModel, secondMovieModel];
    });

    afterEach(jest.resetAllMocks);

    describe("getMovies", () => {
        let spyFindAll: jest.SpyInstance;
        beforeEach(() => {
            spyFindAll = jest
                .spyOn(MovieModel, "findAll")
                .mockImplementation(async () => testMovies);
        });

        test("should return all movie models if source is null", async () => {
            const movies = await new MovieRepository().getMovies();

            expect(spyFindAll.mock.calls.length).toBe(1);
            expect(movies.length).toBe(testMovies.length);
        });

        test("should return only movies without episodes if source is only_movies", async () => {
            const movies = await new MovieRepository().getMovies(
                MovieType.onlyMovies
            );

            expect(spyFindAll.mock.calls.length).toBe(1);
            expect(movies.length).toBe(1);
            expect(movies).toStrictEqual(
                testMovies.filter((e) => e.episodes.length == 0)
            );
        });

        test("should return only movies with episodes if source is only_series", async () => {
            const movies = await new MovieRepository().getMovies(
                MovieType.onlySeries
            );

            expect(spyFindAll.mock.calls.length).toBe(1);
            expect(movies.length).toBe(1);
            expect(movies).toStrictEqual(
                testMovies.filter((e) => e.episodes.length != 0)
            );
        });
    });
    describe("getMovie", () => {
        let spyFindOne: jest.SpyInstance;

        beforeEach(() => {
            spyFindOne = jest
                .spyOn(MovieModel, "findOne")
                .mockImplementation(
                    async (options?: FindOptions | undefined) => {
                        if (options == null) return null;
                        const where = options.where as { id: number };
                        const wantedMovie = testMovies.find(
                            (e) => e.id === where.id
                        );
                        return wantedMovie == undefined ? null : wantedMovie;
                    }
                );
        });

        test("should return movie with provided id", async () => {
            const movieId = 2;
            const movie = await new MovieRepository().getMovie(movieId);

            expect(spyFindOne.mock.calls.length).toBe(1);
            expect(movie).not.toBeNull();
            expect(movie).toStrictEqual(
                testMovies.find((e) => e.id === movieId)
            );
        });

        test("should throw NotFoundError if can't find movie with provided id", async () => {
            const movieId = 3;

            const fun = async () => {
                await new MovieRepository().getMovie(movieId);
            };

            await expect(fun()).rejects.toThrow();
        });
    });
});
