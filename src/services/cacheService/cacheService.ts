import { createClient, RedisClientType } from "redis";
import CacheConfig from "../../config/cacheConfig";
import md5 from "md5";
import { gzip, ungzip } from "node-gzip";

export default class CacheService {
    private static instance: CacheService;
    private readonly client: RedisClientType;
    private config: CacheConfig;
    public prefix: string;

    private constructor(config: CacheConfig) {
        this.config = config;
        this.client = createClient({
            url: config.connectionPath,
        });
        this.prefix = config.prefix;
    }

    async connect() {
        await this.client.connect();
    }

    static getInstance(config?: CacheConfig) {
        if (!CacheService.instance) {
            if (config == null)
                throw Error(
                    "When you first initialize CacheService you need to provide a config."
                );
            CacheService.instance = new CacheService(config);
        }
        return CacheService.instance;
    }

    static get isCacheEnabled() {
        const cache = (process.env.ENABLE_CACHE ?? "").toLowerCase();
        return cache === "true" || cache === "yes" || cache === "1";
    }

    requestToHash(request: { [key: string]: any }): string {
        let requestConceitedString = "";

        for (const key in request) {
            requestConceitedString += key.toString();
            requestConceitedString += request[key].toString();
        }

        return md5(requestConceitedString);
    }

    private createPrefix(hash: string): string {
        return `${this.prefix}::${hash}`;
    }

    async checkIfRequestIsInCache(request: { [key: string]: any }) {
        const requestHash = this.requestToHash(request);
        return (await this.client.exists(this.createPrefix(requestHash))) === 1;
    }

    async saveRequestResponseInCache(
        request: { [key: string]: any },
        response: object
    ) {
        const requestHash = this.requestToHash(request);
        const dataToSave = await gzip(JSON.stringify(response));
        await this.client.set(
            this.createPrefix(requestHash),
            dataToSave.toString("base64")
        );
    }

    async getRequestFromCache(request: {
        [key: string]: any;
    }): Promise<string> {
        const requestHash = this.requestToHash(request);
        const cacheData = await this.client.get(this.createPrefix(requestHash));
        if (cacheData === null) return "";
        return (await ungzip(Buffer.from(cacheData, "base64"))).toString();
    }
}
