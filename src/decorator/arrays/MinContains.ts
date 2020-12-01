import { propertyValidator } from '../../complier';

/**
 * The value of these keywords should be an integer.
 *
 * Without `contains` keyword they are ignored (logs error or throws exception in ajv [strict mode](https://github.com/ajv-validator/ajv/blob/master/docs/strict-mode.md)).
 *
 * The array is valid if it contains at least `minContains` items and no more than `maxContains` items that are valid against the schema in `contains` keyword.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxcontains--mincontains)
 */
export function MinContains(minContains: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], minContains: minContains };
        return map;
    };
    return propertyValidator(mapper);
}
