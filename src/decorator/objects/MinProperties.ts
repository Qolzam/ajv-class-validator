import { propertyValidator } from '../../complier';

/**
 * The value of the keywords should be a number. The data object to be valid should have not less properties than the keyword value.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxproperties--minproperties)
 */
export function MinProperties(minProperties: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], minProperties: minProperties };
        return map;
    };
    return propertyValidator(mapper);
}
