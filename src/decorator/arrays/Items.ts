import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be an object or an array of objects.
 *
 * If the keyword value is an object, then for the data array to be valid each item of the array should be valid according to the schema in this value. In this case the `additionalItems` keyword is ignored.
 *
 * If the keyword value is an array, then `items` with indices less than the number of `items` in the keyword should be valid according to the schemas with the same indices. Whether additional `items` are valid will depend on `additionalItems` keyword.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#items)
 */
export function Items(items: Record<string, string>[]): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], items: items };
        return map;
    };
    return propertyValidator(mapper);
}
