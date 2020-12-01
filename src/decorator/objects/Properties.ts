import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a map with keys equal to data object properties. Each value in the map should be a JSON Schema. For data object to be valid the corresponding values in data object properties should be valid according to these schemas.

**Please note**: `properties` keyword does not require that the properties mentioned in it are present in the object (see examples).

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#properties)

 */
export function Properties(properties: any): Function {
    const mapper = (map: Record<string, unknown>) => {
        map.properties = properties;
        return map;
    };
    return propertyValidator(mapper);
}
