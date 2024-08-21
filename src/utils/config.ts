const prompt = require('prompt-sync')();

const configPrototype: Config = {
    PREFIX: undefined,
    activities: {
        name: undefined
    },
    status: undefined,
    clientId: undefined,
    developerId: undefined,
    log: {
        guildId: undefined,
        guildJoinChannelId: undefined,
        guildLeaveChannelId: undefined,
        executeChannelId: undefined,
        uncaughtExceptionChannelId: undefined,
        errorChannelId: undefined,
    },
    embedColor: {
        primary: undefined,
        invisible: undefined,
        alert: undefined
    }
}



function initializeConfig(config: Config): void {
    console.log(isValid(configPrototype, config));


}

function isValid(prototype: object, config: object): { isValid: boolean, invalidValues?: string[] } {
    let _isValid: boolean = true;
    let _invalidValues: any = [];

    for (const i in prototype) {
        if (Object.prototype.hasOwnProperty.call(prototype, i)) {
            const element = (prototype as any)[i];

            if (typeof element == "object") {
                for (const j in element) {
                    if (Object.prototype.hasOwnProperty.call(element, j)) {
                        const _element = (element as any)[j]

                        if (!(config as any)[i][j]) {
                            _isValid = false;
                            _invalidValues.push({
                                i: i,
                                j: j
                            });
                        }

                    }
                }
            } else {


                if (!(config as any)[i]) {
                    _invalidValues.push({
                        i: i
                    });
                    _isValid = false;
                }

            }
        }
    }
    return { isValid: _isValid, invalidValues: _invalidValues };
}


export { initializeConfig }