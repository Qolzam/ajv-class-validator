import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a string. The data to be valid should match the regular expression defined by the keyword value.
 * Ajv uses new RegExp(value, "u") to create the regular expression that will be used to test data.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#pattern)
 */
export function Pattern(pattern: string): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], pattern: pattern };
        return map;
    };
    return propertyValidator(mapper);
}
