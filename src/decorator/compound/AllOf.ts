import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be an array of JSON Schemas. The data is valid if it is valid according to all JSON Schemas in this array.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#allof)
 */
export function AllOf(allOf: any): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], allOf: allOf };
        return map;
    };
    return propertyValidator(mapper);
}
