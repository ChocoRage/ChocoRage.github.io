import {PlayerResource} from "../models/ResourceModel"
import {resourceTypes, energyResource, scoreResource} from "../database/Database"

export class ResourceManager {
    static getInitialPlayerResources(): {[resourceName: string]: PlayerResource} {
        var playerResources = {}
        resourceTypes.map((resourceType) => {
            switch(resourceType) {
                case energyResource:
                playerResources[resourceType.name] = new PlayerResource(10)
                break
                case scoreResource:
                playerResources[resourceType.name] = new PlayerResource(0)
                break
                default:
                playerResources[resourceType.name] = new PlayerResource(0)
                break
            }
        })
        
        return playerResources
    }
}