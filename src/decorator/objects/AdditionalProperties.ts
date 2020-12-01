import { JSONSchemaType, SchemaObject } from 'ajv';
import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be either a boolean or a JSON Schema.

If the value is `true` the keyword is ignored.

If the value is `false` the data object to be valid should not have "additional properties" (i.e. properties other than those used in "properties" keyword and those that match patterns in "patternProperties" keyword).

If the value is a schema for the data object to be valid the values in all "additional properties" should be valid according to this schema.

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#additionalproperties)
 */
export function AdditionalProperties(
    additionalProperties: boolean | SchemaObject | JSONSchemaType<unknown, false>,
): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['additionalProperties'] = additionalProperties;
        return map;
    };
    return propertyValidator(mapper);
}
