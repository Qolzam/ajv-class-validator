import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be an array of JSON Schemas. The data is valid if it matches exactly one JSON Schema from this array. Validators have to validate data against all schemas to establish validity according to this keyword.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#oneof)
 */
export function OneOf(oneOf: any): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], oneOf: oneOf };
        return map;
    };
    return propertyValidator(mapper);
}
