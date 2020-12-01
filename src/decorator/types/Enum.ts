import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be an array of unique items of any types. The data is valid if it is deeply equal to one of items in the array.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#enum)
 */
export function Enum(enumType: any[]): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        const parsed = { ...map.properties[key], enum: enumType };
        map.properties[key] = parsed;
        return map;
    };
    return propertyValidator(mapper);
}
