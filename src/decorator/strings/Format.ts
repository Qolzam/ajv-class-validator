import { propertyValidator } from '../../complier';

/**
 * The value of the keyword should be a string. The data to be valid should match the format with this name.
 * NOTE: Ajv does not include any formats, they can be added with [ajv-formats](https://github.com/ajv-validator/ajv-formats) plugin.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#format)
 */
export function Format(format: string): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], format: format };
        return map;
    };
    return propertyValidator(mapper);
}
