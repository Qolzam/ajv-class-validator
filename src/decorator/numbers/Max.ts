import { propertyValidator } from '../../complier';

/**
 * The value of keyword `maximum` should be a number. This value is the `maximum` allowed value for the data to be valid.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maximum--minimum-and-exclusivemaximum--exclusiveminimum)
 */
export function Max(maximum: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], maximum: maximum };
        return map;
    };
    return propertyValidator(mapper);
}
