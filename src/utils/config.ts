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

function isValid(prototype: object, config: object): boolean {
    let _isValid: boolean = true;

    for (const i in prototype) {
        if (Object.prototype.hasOwnProperty.call(prototype, i)) {
            const element = (prototype as any)[i];
            
            if(typeof element == "object"){
                for(const j in element){
                    if(Object.prototype.hasOwnProperty.call(element, j)){
                        const _element = (element as any)[j]
   
                        if(!(config as any)[i][j]){
                            _isValid = false;
                        }

                    }
                }
            }else{


                if(!(config as any)[i]) {
                    _isValid = false;
                }


            }
        }
    }
    return _isValid; 
}


export { initializeConfig }