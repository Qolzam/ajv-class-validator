import { propertyValidator } from '../../complier';

/**
 * The value of keyword exclusiveMaximum should be a number. This value is the exclusive maximum allowed value for the data to be valid (the data equal to this keyword value is invalid).
 * Please note: Boolean value for keywords exclusiveMaximum is no longer supported.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maximum--minimum-and-exclusivemaximum--exclusiveminimum)
 *
 */
export function ExclusiveMaximum(exclusiveMaximum: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], exclusiveMaximum: exclusiveMaximum };
        return map;
    };
    return propertyValidator(mapper);
}
