import { validateClass } from '../../complier';

/**
 * The value of the keywords should be a number. The data object to be valid should have not more properties than the keyword value.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxproperties--minproperties)
 */
export function MaxProperties(maxProperties: number): Function {
    const mapper = (map: Record<string, unknown>) => {
        map = { ...map, maxProperties: maxProperties };
        return map;
    };
    return validateClass(mapper);
}
