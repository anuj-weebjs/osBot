function initializeConfig(config: Config): void{
    checkConfig(config);
}

function checkConfig(config: Config):boolean{
    for (const i in config) {
        if (Object.prototype.hasOwnProperty.call(config, i)) {
            const element = config[i];
            console.log(element)
        }
    }
    return true;
}

export {initializeConfig}