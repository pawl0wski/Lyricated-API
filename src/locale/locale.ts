export default class Locale {
    static itMayBeInternalError = "it may be due to an internal server error";

    static createUpdateErrorText(
        objectName: string,
        additionalText?: string
    ): string {
        return `The ${objectName} cannot be updated, ${
            additionalText ?? Locale.itMayBeInternalError
        }`;
    }

    static createCreateErrorText(
        objectName: string,
        additionalText?: string
    ): string {
        return `Unable to add ${objectName}, ${
            additionalText ?? Locale.itMayBeInternalError
        }`;
    }

    static createNotFoundErrorText(objectName: string): string {
        return `Unable to find a ${objectName} with the given id`;
    }

    static createDeleteErrorText(
        objectName: string,
        additionalText?: string
    ): string {
        return `Unable to remove ${objectName}, ${
            additionalText ?? Locale.itMayBeInternalError
        }`;
    }

    static createCreateObjectFirstText(objectName: string): string {
        return `There is no ${objectName} you provided, create it first`;
    }

    static createThereIsNoObjectText(objectName: string): string {
        return `There is no any ${objectName}`;
    }

    static createAlreadyExistsText(objectName: string): string {
        return `Object ${objectName} already exists`;
    }
}
