import { JSONSchemaType, SchemaObject } from 'ajv';
import { propertyValidator } from '../../complier';

/**
 * The value of this keyword is a JSON Schema (can be a boolean).

This schema will be applied to all properties that were not evaluated by other keywords for properties (`properties`, `patternProperties` and `additionalProperties`) in the current schema and all sub-schemas that were valid for this data instance. It includes:

- all subschemas schemas in `allOf` and `$ref` keywords
- valid sub-schemas in `oneOf` and `anyOf` keywords
- sub-schema in `if` keyword
- sub-schemas in `then` or `else` keywords that were applied based on the validation result by `if` keyword.

Some user-defined keywords can also make properties "evaluated".

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#unevaluatedproperties)
 */
export function UnevaluatedProperties(
    unevaluatedProperties: boolean | SchemaObject | JSONSchemaType<unknown, false>,
): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['unevaluatedProperties'] = unevaluatedProperties;
        return map;
    };
    return propertyValidator(mapper);
}
