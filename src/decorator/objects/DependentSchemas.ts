import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a map with keys equal to data object properties. Each value in the map should be a JSON Schema.

If the data object contains a property that is a key in the keyword value, then to be valid the data object itself (NOT the property value) should be valid according to the corresponding schema in this keyword.

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#dependentschemas)

 */
export function DependentSchemas(dependentSchemas: any): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['dependentSchemas'] = dependentSchemas;
        return map;
    };
    return propertyValidator(mapper);
}
