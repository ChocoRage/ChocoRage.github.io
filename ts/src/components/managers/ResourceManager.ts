import {ResourceType, ResourceModel}  from "../models/ResourceModel"

export const res1 = new ResourceType("res1")

export class ResourceManager {
    static getNextResourceId(resourceModel: ResourceModel): number {
        var currentMaxId = -1
        Object.keys(resourceModel.resourceTypes).map(resId => {
            currentMaxId = Math.max(resourceModel.resourceTypes[parseInt(resId)].id, currentMaxId)
        })
        return currentMaxId + 1
    }

    static addResourceType(resourceType: ResourceType, resourceModel: ResourceModel) {
        var id = ResourceManager.getNextResourceId(resourceModel)
        resourceModel.resourceTypes[id] = resourceType
        resourceType.id = id
    }
}