function initializeConfig(config: Config): void {
    if (isValid(config)) return;


}

function isValid(config: Config): boolean {
    for (const i in config) {
        if (Object.prototype.hasOwnProperty.call(config, i)) {
            const element = (config as any)[i];
            console.log(`Element: ${element}, key: ${i}`)

            
            if(typeof element == "object"){
                for(const j in element){
                    if(Object.prototype.hasOwnProperty.call(element, j)){
                        const _element = (element as any)[j]


                        


                    }
                }
            }
            
        }
    }
    return true;
}

export { initializeConfig }