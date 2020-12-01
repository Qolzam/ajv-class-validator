import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a JSON Schema. The data is valid if it is invalid according to this schema.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#not)
 */
export function Not(not: any): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], not: not };
        return map;
    };
    return propertyValidator(mapper);
}
