import { propertyValidator } from '../../complier';

/**
 * The value of the keyword is a JSON Schema. The array is valid if it contains at least one item that is valid according to this schema.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#contains)
 */
export function Contains(contains: Record<string, any>): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], contains: contains };
        return map;
    };
    return propertyValidator(mapper);
}
