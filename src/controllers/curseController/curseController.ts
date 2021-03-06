import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Query,
    Response,
    Route,
    Security,
    Tags,
} from "tsoa";
import ErrorResponse from "../../models/response/errors/errorResponse";
import PutCurseRequest from "../../models/request/putCurseRequest";
import CurseResponse from "../../models/response/curseResponse";
import CurseRepository from "../../repositories/curseRepository/curseRepository";
import PostCurseRequest from "../../models/request/postCurseRequest";

@Route("curse")
@Tags("Curse")
export class CurseController extends Controller {
    private repo: CurseRepository;

    constructor(repo?: CurseRepository) {
        super();
        this.repo = repo ?? new CurseRepository();
    }

    /**
     * It allows to add a new Curse to the database.
     * You need "contributor" permission to use this endpoint.
     **/
    @Post("new")
    @Security("api_key", ["contributor"])
    @Response<CurseResponse>(200, "OK")
    public async postCurse(@Body() request: PostCurseRequest) {
        const newCurse = await this.repo.createCurse(request);
        return CurseResponse.fromModel(newCurse);
    }

    /**
     * It allows to find the Curse's that exist in the database.
     * The only_lang option is optional, it allows you to get Curse's only for a specific language.
     * You need "client" permission to use this endpoint.
     **/
    @Get("find")
    @Security("api_key", ["client"])
    @Response<{ curses: CurseResponse[] }>(200, "OK")
    public async getCurses(
        @Query("only_lang") onlyLang?: string
    ): Promise<{ curses: CurseResponse[] }> {
        const curses = await this.repo.getCurses(onlyLang);
        return {
            curses: curses.map((e) => {
                return CurseResponse.fromModel(e);
            }),
        };
    }

    /**
     * It allows you to get the Curse specified with id.
     * You need "client" permission to use this endpoint.
     **/
    @Get("{id}")
    @Security("api_key", ["client"])
    @Response<CurseResponse>(200, "OK")
    @Response<ErrorResponse>(404, "Error")
    public async getCurse(@Path("id") id: number) {
        const curse = await this.repo.getCurse(id);
        return CurseResponse.fromModel(curse);
    }

    /**
     * It allows you to update a Curse that is already in the database.
     * You need "contributor" permission to use this endpoint.
     **/
    @Put("{id}")
    @Security("api_key", ["contributor"])
    @Response<CurseResponse>(200, "OK")
    @Response<ErrorResponse>(404, "Error")
    public async putCurse(
        @Path("id") id: number,
        @Body() request: PutCurseRequest
    ) {
        const updatedCurse = await this.repo.updateCurse(id, request);
        return CurseResponse.fromModel(updatedCurse);
    }

    /**
     * It allows you to delete a Curse that is already in the database.
     * You need "contributor" permission to use this endpoint.
     **/
    @Delete("{id}")
    @Security("api_key", ["contributor"])
    @Response<CurseResponse>(200, "OK")
    @Response<ErrorResponse>(404, "Error")
    public async deleteCurse(@Path("id") id: number) {
        const curse = await this.repo.deleteCurse(id);
        return CurseResponse.fromModel(curse);
    }
}
