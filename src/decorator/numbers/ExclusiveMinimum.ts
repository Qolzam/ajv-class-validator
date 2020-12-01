import { propertyValidator } from '../../complier';

/**
 * The value of keyword exclusiveMinimum should be a number. This value is the exclusive minimum allowed value for the data to be valid (the data equal to this keyword value is invalid).
 * Please note: Boolean value for keywords exclusiveMinimum is no longer supported.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maximum--minimum-and-exclusivemaximum--exclusiveminimum)
 *
 */
export function ExclusiveMinimum(exclusiveMinimum: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], exclusiveMinimum: exclusiveMinimum };
        return map;
    };
    return propertyValidator(mapper);
}
