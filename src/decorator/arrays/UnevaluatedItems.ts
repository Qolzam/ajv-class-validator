import { JSONSchemaType, SchemaObject } from 'ajv';
import { propertyValidator } from '../../complier';

/**
The value of this keyword is a JSON Schema (can be a boolean).

This schema will be applied to all array items that were not evaluated by other keywords for items (`items`, `additionalItems` and `contains`) in the current schema and all sub-schemas that were valid for this data instance. It includes:

- all subschemas schemas in `allOf` and `$ref` keywords
- valid sub-schemas in `oneOf` and `anyOf` keywords
- sub-schema in `if` keyword
- sub-schemas in `then` or `else` keywords that were applied based on the validation result by `if` keyword.

The only scenario when this keyword would be applied to some items is when `items` keyword value is an array of schemas and `additionalItems` was not present (or did not apply, in case it was present in some invalid subschema).

Some user-defined keywords can also make items "evaluated".

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#unevaluateditems)
 */
export function UnevaluatedItems(unevaluatedItems: boolean | SchemaObject | JSONSchemaType<unknown, false>): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], unevaluatedItems: unevaluatedItems };
        return map;
    };
    return propertyValidator(mapper);
}
