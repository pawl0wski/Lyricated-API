import SearchServiceAbstractHandler from "./searchServiceAbstractHandler";
import SearchServiceState from "../../interfaces/searchServiceState";
import TranslateService from "../../../translateService/translateService";

export default class SearchServiceTranslationsHandler extends SearchServiceAbstractHandler {
    handlerName = "translate";

    public async handle(state: SearchServiceState) {
        this._beforeHandle();
        const {
            search_phrase: phrase,
            from_lang_id: fromLang,
            to_lang_id: toLang,
        } = state.request;

        const translationService = new TranslateService();

        state.translations = await translationService.getTranslations(
            phrase,
            fromLang,
            toLang
        );

        state.translations = state.translations.filter(
            (e) => e !== state.request.search_phrase.toLowerCase()
        );

        this._afterHandle(state);
        return await super.handle(state);
    }
}
