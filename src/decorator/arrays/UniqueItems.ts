import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a boolean. If the keyword value is true, the data array to be valid should have unique items.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#uniqueitems)
 */
export function UniqueItems(uniqueItems: boolean): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], uniqueItems: uniqueItems };
        return map;
    };
    return propertyValidator(mapper);
}
