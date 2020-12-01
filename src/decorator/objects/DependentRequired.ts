import { propertyValidator } from '../../complier';

/**
 * The value of this keyword should be a map with keys equal to data object properties. Each value in the map should be an array of unique property names.

If the data object contains a property that is a key in the keyword value, then to be valid the data object should also contain all properties from the corresponding array of properties in this keyword.

[AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#dependentrequired)
 */
export function DependentRequired(dependentRequired: any): Function {
    const mapper = (map: Record<string, unknown>) => {
        map['dependentRequired'] = dependentRequired;
        return map;
    };
    return propertyValidator(mapper);
}
