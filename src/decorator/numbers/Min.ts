import { propertyValidator } from '../../complier';

/**
 * The value of keyword `minimum` should be a number. This value is the `minimum` allowed value for the data to be valid.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maximum--minimum-and-exclusivemaximum--exclusiveminimum)
 *
 */
export function Min(minimum: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], minimum: minimum };
        return map;
    };
    return propertyValidator(mapper);
}
