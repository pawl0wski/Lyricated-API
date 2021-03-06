import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Index,
    Model,
    Table,
} from "sequelize-typescript";
import MovieModel from "./movieModel";
import LyricSentenceModel from "./translations/lyricSentenceModel";
import EpisodeModel from "./episodeModel";

@Table
export default class LyricModel extends Model {
    @Index
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ForeignKey(() => MovieModel)
    @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
    movieId: number;

    @ForeignKey(() => EpisodeModel)
    @Column({ type: DataType.INTEGER, allowNull: true, unique: false })
    episodeId: number | null;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    seconds: number;

    @Column({ type: DataType.SMALLINT, allowNull: true })
    quality: number | null;

    @HasMany(() => LyricSentenceModel)
    sentences: LyricSentenceModel[];

    @BelongsTo(() => MovieModel, { foreignKey: "movieId" })
    movie: MovieModel;

    @BelongsTo(() => EpisodeModel, { foreignKey: "episodeId" })
    episode: EpisodeModel;
}
