import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be an array of unique strings. The data object to be valid should contain all properties with names equal to the elements in the keyword value.
 *
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#required)
 */
export function Required(): Function {
    const mapper = (map: Record<string, any>, key: string) => {
        map['required'] = map['required'] ? [...map['required'], key] : [key];
        return map;
    };
    return propertyValidator(mapper);
}
