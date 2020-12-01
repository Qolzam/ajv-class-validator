import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a number. The data to be valid should be a multiple of the keyword value (i.e. the result of division of the data on the value should be integer).
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#multipleof)
 */
export function MultipleOf(multipleOf: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], multipleOf: multipleOf };
        return map;
    };
    return propertyValidator(mapper);
}
