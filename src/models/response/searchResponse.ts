import SearchResultResponse from "./searchResultResponse";
import HandlerTimeResponse from "./handlerTimeResponse";

export default interface SearchResponse {
    from_lang_id: string;
    to_lang_id: string;
    search_phrase: string;
    translations: string[];
    main_results: SearchResultResponse[];
    similar_results: SearchResultResponse[];
    handlers_time: HandlerTimeResponse[];
}
