import { propertyValidator } from '../../complier';

/**
 * The value of the keywords should be a number. The data array to be valid should not have less items than the keyword value.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxitems--minitems)
 */
export function MinItems(minItems: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], minItems: minItems };
        return map;
    };
    return propertyValidator(mapper);
}
