import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a boolean or an object.
 *
 * If `items` keyword is not present or it is an object, `additionalItems` keyword should be ignored regardless of its value. By default Ajv will throw exception in this case - see [Strict mode](https://github.com/ajv-validator/ajv/blob/master/docs/strict-mode.md)
 *
 * If `items` keyword is an array and data array has not more `items` than the length of `items` keyword value, `additionalItems` keyword is also ignored.
 *
 * If the length of data array is bigger than the length of "items" keyword value than the result of the validation depends on the value of additionalItems keyword:
 * - false: data is invalid
 * - true: data is valid
 * - an object: data is valid if all additional items (i.e. items with indices greater or equal than "items" keyword value length) are valid according to the schema in "additionalItems" keyword.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#additionalitems)
 */
export function AdditionalItems(additionalItems: boolean): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], additionalItems: additionalItems };
        return map;
    };
    return propertyValidator(mapper);
}
