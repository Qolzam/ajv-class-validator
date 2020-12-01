import { propertyValidator } from '../../complier';

/**
 * The value of this keyword should be a map where keys should be regular expressions and the values should be JSON Schemas. For data object to be valid the values in data object properties that match regular expression(s) should be valid according to the corresponding schema(s).

When the value in data object property matches multiple regular expressions it should be valid according to all the schemas for all matched regular expressions.

**Please note**:

1. `patternProperties` keyword does not require that properties matching patterns are present in the object (see examples).
2. By default, Ajv does not allow schemas where patterns in `patternProperties` match any property name in `properties` keyword - that leads to unexpected validation results. It can be allowed with option `allowMatchingProperties`. See [Strict mode](https://github.com/ajv-validator/ajv/blob/master/docs/strict-mode.md)

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#patternproperties)
 */
export function PatternProperties(patternProperties: any): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['patternProperties'] = patternProperties;
        return map;
    };
    return propertyValidator(mapper);
}
