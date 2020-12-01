import { propertyValidator } from '../../complier';

/**
 * These keywords allow to implement conditional validation. Their values should be valid JSON Schemas (object or boolean).

If `if` keyword is absent, the validation succeeds.

If the data is valid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `then` keyword (if `then` is absent, the validation succeeds).

If the data is invalid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `else` keyword (if `else` is absent, the validation succeeds).

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#ifthenelse)
 */
export function Then(thenOperation: any): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], then: thenOperation };
        return map;
    };
    return propertyValidator(mapper);
}
