import { propertyValidator } from '../../complier';

/**
 * The value of this keyword is a JSON Schema.

For data object to be valid each property name in this object should be valid according to this schema.

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#propertynames)
 */
export function PropertyNames(propertyNames: any): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['propertyNames'] = propertyNames;
        return map;
    };
    return propertyValidator(mapper);
}
