import { propertyValidator } from '../../complier';

/**
 * The value of the keywords should be a number. The data array to be valid should not have more items than the keyword value.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxitems--minitems)
 */
export function MaxItems(maxItems: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], maxItems: maxItems };
        return map;
    };
    return propertyValidator(mapper);
}
